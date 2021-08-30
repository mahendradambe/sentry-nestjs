import { Test, TestingModule } from "@nestjs/testing";
import { SentryModule, SentryService } from "../src";
import { SENTRY } from "../src/constants/sentry-nestjs.tokens";

describe( "SentryModule", () => {

    describe( 'when using `forRoot`', () => {

        describe( 'and called with empty object', () => {

            it( 'should provide SentryService', async () => {

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

} );
