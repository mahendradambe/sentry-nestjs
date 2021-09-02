import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlContextType } from '@nestjs/graphql';
import { Handlers } from '@sentry/node';
import { Scope } from "@sentry/types";
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

        // a transaction maybe present with express integrations
        const maybeTransaction = Boolean( this.sentryService.currentTransaction )

        const transaction = maybeTransaction
            ? this.sentryService.currentTransaction
            : this.sentryService
                .currentHub
                .startTransaction( { name: context.getHandler().name } )

        // if this is a custom transaction, we want to know so we can finish it
        if ( !maybeTransaction ) {
            ( transaction as any ).__customTrace = true
        }

        const span = transaction.startChild()

        this.sentryService.setSpanOnCurrentScope( span );

        switch( contextType ) {

            case 'http':
                return this.handleHttp( context, next )

            case 'rpc':
                return next.handle();

            case 'ws':
                return next.handle();

            case 'graphql':
                return next.handle()

        }

    }

    private handleHttp( context: ExecutionContext, next: CallHandler ) {

        const transaction = this.sentryService.currentTransaction
        const span = this.sentryService.currentSpan

        const httpRequest = context.switchToHttp().getRequest<EnhancedHttpRequest>()

        transaction.name = `${httpRequest.method} ${httpRequest.route.path}`
        transaction.op = `${httpRequest.method} ${httpRequest.route.path}`
        span.op = `${context.getClass().name}#${context.getHandler().name}`
        span.description = httpRequest.url
        httpRequest.span = span
        httpRequest.transaction = transaction

        const response = next.handle()

        return response.pipe(
            tap( {
                next: ( value ) => {
                    this.captureHttpData( this.sentryService.currentScope, httpRequest, value )
                    span.finish()

                    if( ( transaction as any ).__customTrace ) {

                        transaction.finish()

                    }

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
