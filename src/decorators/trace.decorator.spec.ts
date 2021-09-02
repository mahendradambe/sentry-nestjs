import { SENTRY_TRACE } from '../constants/instrument.tokens';
import { Trace } from './trace.decorator'
import { TraceOptions } from '../interfaces';

describe( 'Trace', () => {

    describe( 'and called with no arguments', () => {

        class SomeService {

            @Trace()
            someMethod() {
                return 'hello'
            }

        }
        const someService = new SomeService()

        it( 'should decorate the method with `SENTRY_TRACE` ', async () => {

            expect(
                Reflect.hasMetadata( SENTRY_TRACE, someService.someMethod )
            )

        } );

        it( 'should define `SENTRY_TRACE` metadata with default `TraceOptionsWithSpan`', () => {

            expect(
                Reflect.getMetadata( SENTRY_TRACE, someService.someMethod )
            ).toStrictEqual( { name: someService.someMethod.name, injectSpan: false } )

        } )

    } )

    describe( 'and called with `name` as first arg', () => {

        const name = 'someOtherName'
        class SomeService {

            @Trace( name )
            someMethod() {
                return 'hello'
            }

        }
        const someService = new SomeService()

        it( 'should define `SENTRY_TRACE` metadata with `TraceOptionsWithSpan`', () => {

            expect(
                Reflect.getMetadata( SENTRY_TRACE, someService.someMethod )
            ).toStrictEqual( { name, injectSpan: false } )

        } )

    } )

    describe( 'and called with a boolean as first arg', () => {

        describe( 'and it is `true`', () => {

            class SomeService {

                @Trace( true )
                someMethod() {
                    return 'hello'
                }

            }
            const someService = new SomeService()

            it( 'should define `SENTRY_TRACE` metadata with `TraceOptionsWithSpan`', () => {

                expect(
                    Reflect.getMetadata( SENTRY_TRACE, someService.someMethod )
                ).toStrictEqual( { name: someService.someMethod.name, injectSpan: true } )

            } )

        } )

        describe( 'and it is `false`', () => {

            class SomeService {

                @Trace( false )
                someMethod() {
                    return 'hello'
                }

            }
            const someService = new SomeService()

            it( 'should define `SENTRY_TRACE` metadata with `TraceOptionsWithSpan`', () => {

                expect(
                    Reflect.getMetadata( SENTRY_TRACE, someService.someMethod )
                ).toStrictEqual( { name: someService.someMethod.name, injectSpan: false } )

            } )

        } )

    } )

    describe( 'and called with `options` as first arg', () => {

        const options: TraceOptions = {
            name: 'someOtherMethod',
            description: 'some other method description',
            tags: {
                'prop': 'description '
            }
        }
        class SomeService {

            @Trace( options )
            someMethod() {
                return 'hello'
            }

        }
        const someService = new SomeService()

        it( 'should define `SENTRY_TRACE` metadata with `TraceOptionsWithSpan`', () => {

            expect(
                Reflect.getMetadata( SENTRY_TRACE, someService.someMethod )
            ).toStrictEqual( { ...options, injectSpan: false } )

        } )

    } )

    describe( 'and called with boolean as second arg', () => {

        const name = 'someOtherMethod'

        describe( 'and it is `true`', () => {

            class SomeService {

                @Trace( name, true )
                someMethod() {
                    return 'hello'
                }

            }

            const someService = new SomeService()

            it( 'should define `SENTRY_TRACE` metadata with `TraceOptionsWithSpan`', () => {

                expect(
                    Reflect.getMetadata( SENTRY_TRACE, someService.someMethod )
                ).toStrictEqual( { name, injectSpan: true } )

            } )

        } )

        describe( 'and it is `false`', () => {

            class SomeService {

                @Trace( name, false )
                someMethod() {
                    return 'hello'
                }

            }

            const someService = new SomeService()

            it( 'should define `SENTRY_TRACE` metadata with `TraceOptionsWithSpan`', () => {

                expect(
                    Reflect.getMetadata( SENTRY_TRACE, someService.someMethod )
                ).toStrictEqual( { name, injectSpan: false } )

            } )

        } )

    } )

} )

