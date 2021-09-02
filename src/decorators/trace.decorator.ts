import { SetMetadata } from "@nestjs/common"
import { SENTRY_TRACE } from "../constants/instrument.tokens"
import {
    TraceDecorator,
    TraceOptions,
    TraceOptionsWithSpan
} from "../interfaces"

const propertyKeyToString = ( key: string | symbol ) => typeof key === 'string' ? key : key.description

const getTraceOptions = (
    propertyKey: string | symbol,
    nameOrOptionOrInjectSpan: string | TraceOptions | boolean,
    injectSpan = false
): TraceOptionsWithSpan => {

    const options = typeof nameOrOptionOrInjectSpan === 'string'
        ? {
            name: nameOrOptionOrInjectSpan,
            injectSpan
        }
        : typeof nameOrOptionOrInjectSpan !== 'boolean'
        ? {
            ...nameOrOptionOrInjectSpan,
            injectSpan,
            name: nameOrOptionOrInjectSpan?.name ?? propertyKeyToString( propertyKey )
        }
        : {
            injectSpan: nameOrOptionOrInjectSpan,
            name: propertyKeyToString( propertyKey )
        }

    return options

}

export const Trace: TraceDecorator = ( nameOrOptions?: string | TraceOptions | boolean, injectSpan  = false ): MethodDecorator =>
    ( target: Record<string, any>, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any> ) => {

        const options = getTraceOptions( propertyKey, nameOrOptions, injectSpan )

        SetMetadata( SENTRY_TRACE, options )( target, propertyKey, descriptor )

    }
