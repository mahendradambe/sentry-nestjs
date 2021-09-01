import { Test, TestingModule } from "@nestjs/testing";
import { SentryModule, SentryService } from "../src";
import { SENTRY } from "../src/constants/sentry-nestjs.tokens";

describe( "SentryModule", () => {

    describe( 'when using `forRoot`', () => {

        describe( 'and called with empty object', () => {

            it( 'should provide `SentryService`', async () => {

                const app: TestingModule = await Test.createTestingModule( {
                    imports: [
                        SentryModule.forRoot( {} )
                    ]
                } ).compile();

                const sentryService = app.get<SentryService>( SENTRY );

                expect( sentryService ).toBeDefined()
                expect( sentryService ).toBeInstanceOf( SentryService )

            } );

        } )

    } )

    describe( 'when using `forRootAsync`', () => {

        describe( 'and called with `useFactory`', () => {

            it( 'should provide `SentryService`', async () => {

                const app: TestingModule = await Test.createTestingModule( {

                    imports: [
                        SentryModule.forRootAsync( {
                            useFactory: () => ( {} )
                        } )
                    ]

                } ).compile();

                const sentryService = app.get<SentryService>( SENTRY );

                console.log( sentryService )

                expect( sentryService ).toBeDefined()
                expect( sentryService ).toBeInstanceOf( SentryService )

            } );

        } )

        describe( 'and called with `useClass`', () => {

            it( 'should provide `SentryService`', async () => {

                class OptionsFactory {

                    createNestjsSentryModuleOptions() {

                        return {}

                    }

                }

                const app: TestingModule = await Test.createTestingModule( {

                    imports: [
                        SentryModule.forRootAsync( {
                            useClass: OptionsFactory
                        } )
                    ]

                } ).compile();

                const sentryService = app.get<SentryService>( SENTRY );

                expect( sentryService ).toBeDefined()
                expect( sentryService ).toBeInstanceOf( SentryService )

            } );

        } )

    } )

} );
