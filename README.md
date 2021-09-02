<h1 align="center"></h1>

<div align="center" style="display: flex; align-items:center; justify-content:center">
  <a href="http://nestjs.com/" target="_blank" style="padding-right: 16px">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
  <a href="http://nestjs.com/" target="_blank">
    <svg xmlns="http://www.w3.org/2000/svg" width="150" viewBox="0 0 200 44" class="css-13o7eu2 e148u49z0"><path fill="currentColor" d="M124.32,28.28,109.56,9.22h-3.68V34.77h3.73V15.19l15.18,19.58h3.26V9.22h-3.73ZM87.15,23.54h13.23V20.22H87.14V12.53h14.93V9.21H83.34V34.77h18.92V31.45H87.14ZM71.59,20.3h0C66.44,19.06,65,18.08,65,15.7c0-2.14,1.89-3.59,4.71-3.59a12.06,12.06,0,0,1,7.07,2.55l2-2.83a14.1,14.1,0,0,0-9-3c-5.06,0-8.59,3-8.59,7.27,0,4.6,3,6.19,8.46,7.52C74.51,24.74,76,25.78,76,28.11s-2,3.77-5.09,3.77a12.34,12.34,0,0,1-8.3-3.26l-2.25,2.69a15.94,15.94,0,0,0,10.42,3.85c5.48,0,9-2.95,9-7.51C79.75,23.79,77.47,21.72,71.59,20.3ZM195.7,9.22l-7.69,12-7.64-12h-4.46L186,24.67V34.78h3.84V24.55L200,9.22Zm-64.63,3.46h8.37v22.1h3.84V12.68h8.37V9.22H131.08ZM169.41,24.8c3.86-1.07,6-3.77,6-7.63,0-4.91-3.59-8-9.38-8H154.67V34.76h3.8V25.58h6.45l6.48,9.2h4.44l-7-9.82Zm-10.95-2.5V12.6h7.17c3.74,0,5.88,1.77,5.88,4.84s-2.29,4.86-5.84,4.86Z M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z"></path></svg>
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
