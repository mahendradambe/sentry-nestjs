import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlContextType } from '@nestjs/graphql'
import { Handlers } from '@sentry/node';
import { Scope, Span, Transaction } from "@sentry/types";
import { Request } from 'express';
import { tap } from "rxjs";
import { InjectSentry } from "../decorators";
import { EnhancedHttpRequest } from '../interfaces';
import { SentryService } from "../services";

@Injectable()
export class TraceInterceptor implements NestInterceptor {

    constructor(
        @InjectSentry() private readonly sentryService: SentryService,
    ) { }

    intercept( context: ExecutionContext, next: CallHandler ) {

        const contextType = context.getType<GqlContextType>()

        const transaction = this.sentryService.currentTransaction
        const span = transaction.startChild()
        this.sentryService.setSpanOnCurrentScope( span )


        switch( contextType ) {

            case 'http':
                return this.handleHttp( context, next, transaction, span )

            case 'rpc':
                return next.handle();

            case 'ws':
                return next.handle();

            case 'graphql':
                return next.handle()

        }

    }

    private handleHttp( context: ExecutionContext, next: CallHandler, transaction: Transaction, span: Span ) {

        const httpRequest = context.switchToHttp().getRequest<EnhancedHttpRequest>()

        transaction.op = transaction.name
        span.op = `${context.getClass().name}#${context.getHandler().name}`
        span.description = httpRequest.method
        httpRequest.span = span
        httpRequest.transaction = transaction

        const response = next.handle()

        return response.pipe(
            tap( {
                next: ( value ) => {
                    this.captureHttpData( this.sentryService.currentScope, httpRequest, value )
                    span.finish()
                },
                error: exception => this.sentryService
                    .instance()
                    .withScope( scope =>
                        this.captureHttpData( scope, httpRequest, null, exception )
                    ),
            } )
        )

    }

    private captureHttpData( scope: Scope, request: EnhancedHttpRequest, data?: any, exception?: any ) {

        const eventData = Handlers.parseRequest( {}, request, {} )


        if ( eventData.extra ) {

            scope.setExtras( eventData.extra )

        }

        if ( eventData.user ) {

            scope.setUser( eventData.user )

        }

        if ( data ) {

            scope.getTransaction().setData( 'res', data )

        }

        if ( exception ) {

            this.sentryService.captureException( exception )

        }


    }

}
