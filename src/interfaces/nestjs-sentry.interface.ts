import { Handlers } from "@sentry/node"
import { Span, Transaction, Primitive } from "@sentry/types"

export interface TraceOptions {

    name: string;

    description?: string;

    tags?: Record<string, Primitive>;

}

export interface InjectSpanOption {

    injectSpan?: boolean;

}

export type TraceOptionsWithSpan = TraceOptions & InjectSpanOption

export type TraceDecorator = {

    ( injectSpan?: boolean ): MethodDecorator;

    ( name?: string, injectSpan?: boolean ): MethodDecorator;

    ( option?: TraceOptions, injectSpan?: boolean ): MethodDecorator;

}


export interface EnhancedHttpRequest extends Handlers.ExpressRequest {

    span?: Span;

    transaction?: Transaction;

}
