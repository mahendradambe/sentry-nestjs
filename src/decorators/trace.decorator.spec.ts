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
            ).toStrictEqual( { name: someService.someMethod.name } )

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
            ).toStrictEqual( { name } )

        } )

    } )

    describe( 'and called with `options` as first arg', () => {

        describe( 'and when `options.name` is not provided', () => {

            it( 'should use the method\'s name as the name', () => {

                const options: TraceOptions = {
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

                expect(
                    Reflect.getMetadata( SENTRY_TRACE, someService.someMethod )
                ).toStrictEqual( { ...options, name: someService.someMethod.name } )

            } )

        } )

        describe( 'and when options is completely defined', () => {

            it( 'should define `SENTRY_TRACE` metadata with `TraceOptionsWithSpan`', () => {

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

                expect(
                    Reflect.getMetadata( SENTRY_TRACE, someService.someMethod )
                ).toStrictEqual( { ...options } )

            } )

        } )



    } )

} )

