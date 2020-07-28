import '@/styles/main'
import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'
import Raven from 'raven-js'

!window.Promise && (window.Promise = Promise)
process.env.SENTRY_DSN && Raven.config(process.env.SENTRY_DSN, { release: process.env.SENTRY_RELEASE }).install()

createApp(App).use(router).use(store).mount('#app')
