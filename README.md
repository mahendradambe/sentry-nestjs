<h1 align="center"></h1>

<div align="center" style="display: flex; align-items:center; justify-content:center">
  <a href="http://nestjs.com/" target="_blank" style="padding-right: 16px">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
  <a href="https://sentry.io/" target="_blank">
    <img src="https://raw.githubusercontent.com/mahendradambe/sentry-nestjs/master/.images/sentry-wordmark-dark-400x119.png" width="150" alt="Sentry Logo" />
  </a>
</div>

<h3 align="center">Sentry NestJS</h3>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
  <a href="https://badge.fury.io/js/sentry-nestjs">
      <img src="https://badge.fury.io/js/sentry-nestjs.svg" alt="npm version" height="18">
  </a>
</div>

### Features
- Handles creating Transactions, Span and configuring the Scope
    - Avoid Boilerplate for setting up Sentry Express Integration
- `TraceInterceptor` For Controllers to help with creating a Span or Transaction
- `Trace` and `Span` Decorators for Provider Methods
- `InjectSentry` Decorator which provides SentryService with helper methods and getters for Sentry


### Installation
- Using Yarn
```bash
yarn add sentry-nestjs @sentry/node @sentry/tracing
```
- Using NPM
```bash
npm install sentry-nestjs @sentry/node @sentry/tracing
```

### Usage

 1. Register Module
```typescript
import { LogLevel } from '@sentry/types'
import { SentryModule } from 'sentry-nestjs'

@Module( {
    imports: [
        SentryModule.forRoot( {
            dsn: '<sentry-dsn>',
            environment: 'dev',
            debug: true,
            logLevel: LogLevel.Debug,
            sampleRate: 1,
            tracesSampleRate: 1,
            expressTracing: true, // use sentry tracing extensions for express
            // rest of the Sentry.Options
        } ),
    ],
    controllers: [ AppController ],
    service: [ AppService ]
} )

```
2. On HTTP Controller
```typescript
import { Span, Transaction } from '@sentry/types'
import { TraceInterceptor, CurrentSpan, CurrentTransaction } from 'sentry-nestjs'

@Controller()
@UseInterceptor( TraceInterceptor ) // use on controller
class AppController {

    constructor(private readonly appService: AppService)

    @Get()
    @UseInterceptor( TraceInterceptor ) // or just on method
    getHello(
        @CurrentSpan() span: CurrentSpan,
        @CurrentTransaction(): transaction: Transaction
    ) {

        return this.appService.getHello()

    }

}

```
3. On any Provider
```typescript
import { InjectSentry, SentryService } from 'sentry-nestjs'

@Injectable()
@Instrument() // use Instrument to trace all methods
class AppService {

    constructor(
        @InjectSentry() sentry: SentryService
    ) {}

    @Trace() // or, use Trace to trace for individual methods
    getHello() {

        this.sentry.currentSpan.setData('data', 'some-data)

        return this.appService.getHello()

    }

}

```

4. Inspect the generated Trace on your Sentry Dashboard
![Trace on Sentry](/.images/trace.png)

## TODO
- Add Tests

## Author

**Mahendra Dambe** *dambemahendra@gmail.com*

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
