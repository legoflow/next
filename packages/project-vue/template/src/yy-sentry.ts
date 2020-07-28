import Raven from 'raven-js'
process.env.SENTRY_DSN && Raven.config(process.env.SENTRY_DSN, { release: process.env.SENTRY_RELEASE }).install()
