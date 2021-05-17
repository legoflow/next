import '@/styles/main'
import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'

!window.Promise && (window.Promise = Promise)

createApp(App).use(router).use(store).mount('#app')

console.log('[BUILD_MODE]', process.env.BUILD_MODE)
