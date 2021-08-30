<h1 align="center"></h1>

<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
</div>

<h3 align="center">Sentry NestJS</h3>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
</div>

### Installation
- Using Yarn
```bash
yarn add sentry-nestjs
```
- Using NPM
```bash
npm install sentry-nestjs
```

### Usage
 1. Register Module
```typescript
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

        return this.appService.getHello()

    }

}

```

## TODO
- Add Tests

## Author

**Mahendra Dambe** *dambemahendra@gmail.com*

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
