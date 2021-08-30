import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Span } from '@sentry/tracing';
import { CustomSamplingContext, Scope, TransactionContext } from '@sentry/types';

@Injectable()
export class SentryService {

    get currentHub() {

        return Sentry.getCurrentHub()

    }

    get currentScope() {

        return this.currentHub.getScope()

    }

    get currentTransaction() {

        return this.currentScope?.getTransaction()

    }

    get currentSpan() {

        return this.currentScope?.getSpan()

    }

    configureScope( scopeCallback: ( scope: Scope ) => void ) {

        this.currentHub.configureScope( scopeCallback )

    }

    withScope( scopeCallback: ( scope: Scope ) => void ) {

        this.currentHub.configureScope( scopeCallback )

    }

    setSpanOnCurrentScope( span: Span ) {

        this.configureScope( scope => scope.setSpan( span ) )

    }

    createTransaction( context: TransactionContext, customSamplingContext?: CustomSamplingContext ) {

        const transaction = this.currentHub.startTransaction( context, customSamplingContext )

        this.setSpanOnCurrentScope( transaction )

        return transaction

    }

    getOrCreateTransaction( context: TransactionContext, customSamplingContext?: CustomSamplingContext ) {

        if ( this.currentTransaction ) {

            return this.currentTransaction

        } else {

            return this.createTransaction( context, customSamplingContext )

        }

    }

    captureException( exception: any ) {

        Sentry.captureException( exception )

    }

    instance() {

        return Sentry;

    }

}
