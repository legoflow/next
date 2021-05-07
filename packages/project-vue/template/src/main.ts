import '@/styles/main'
import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'

!window.Promise && (window.Promise = Promise)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('app')
