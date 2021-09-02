import { Handlers } from "@sentry/node"
import { Span, Transaction } from "@sentry/types"

export interface TraceOptions {

    name: string;

    description?: string;

    tags?: Record<string, string>;

}

export interface InjectSpanOption {

    injectSpan?: boolean;

}

export type TraceOptionsWithSpan = TraceOptions & InjectSpanOption

export type TraceDecorator = {

    ( name?: string, injectSpan?: boolean ): MethodDecorator;

    ( option?: TraceOptions, injectSpan?: boolean ): MethodDecorator;

}


export interface EnhancedHttpRequest extends Handlers.ExpressRequest {

    span?: Span;

    transaction?: Transaction;

}
