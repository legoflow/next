import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '@/pages/home.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
