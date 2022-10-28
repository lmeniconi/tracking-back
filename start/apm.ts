import Env from '@ioc:Adonis/Core/Env'
import * as Sentry from '@sentry/node'

if (Env.get('NODE_ENV') === 'production')
  Sentry.init({
    dsn: 'https://3bfb3601fcc94992b93d27bbb863e742@o4503899465646080.ingest.sentry.io/4503899467677696',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
