import '@/styles/main'
import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'
import { BUILD_MODE } from './global'

!window.Promise && (window.Promise = Promise)

createApp(App).use(router).use(store).mount('#app')

switch (process.env.BUILD_MODE) {
  case BUILD_MODE.DEVELOP:
    console.log('开发环境')
    break
  case BUILD_MODE.TEST:
    console.log('测试环境')
    break
  case BUILD_MODE.PRODUCTION:
    console.log('生产环境')
    break
}
