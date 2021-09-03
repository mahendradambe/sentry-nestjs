jest.mock( '@sentry/node' )
import { Test } from "@nestjs/testing";
import * as Sentry from '@sentry/node';
import { SENTRY_MODULE_OPTIONS } from "../constants";
import { BootstrapSentry } from "./bootstrap-sentry.service";


describe( "BootstrapSentry", () => {

    describe( 'when application lifecycle hooks are called', () => {

        describe( 'when `SentryModuleOptions` is empty', () => {

            it( 'should call `Sentry.init`', async () => {

                await Test.createTestingModule( {
                    providers: [
                        BootstrapSentry,
                        {
                            provide: SENTRY_MODULE_OPTIONS,
                            useValue: {}
                        }
                    ]
                } )
                .compile()

                expect( Sentry.init ).toBeCalled()

            } )

        } )

        describe( 'when application is shutting down', () => {

            it( 'should call `Sentry.close`', async () => {

                const moduleRef = await Test.createTestingModule( {
                    providers: [
                        BootstrapSentry,
                        {
                            provide: SENTRY_MODULE_OPTIONS,
                            useValue: {}
                        }
                    ]
                } )
                .compile()

                moduleRef.enableShutdownHooks()
                await moduleRef.close()

                expect( Sentry.close ).toBeCalled()

            } )

        } )

    } )

} );
