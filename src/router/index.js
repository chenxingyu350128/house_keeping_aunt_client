// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // redirect: '/index'
    redirect: localStorage.getItem("token") ? "/index" :  "/login"
    // redirect: localStorage.getItem("token") ? "/index" : localStorage.getItem('guideAlready') ? "/login" : "/guidePages"

  },
  // {
  //   path: "/guidePages",
  //   name: "guidePages",
  //   component: () => import('../views/guidePages')
  // },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue')
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/order.vue')
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('../views/mine.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../components/mine/setting.vue')
  },
  {
    path: '/income',
    name: 'income',
    component: () => import('../components/mine/income.vue')
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: () => import('../components/mine/withdraw.vue')
  },
  {
    path: '/userInfo',
    name: 'userInfo',
    component: () => import('../components/mine/userInfo.vue')
  },
  {
    path: '/notification',
    name: 'notification',
    component: () => import('../components/mine/notification.vue')
  },
  {
    path: '/feedBack',
    name: 'feedBack',
    component: () => import('../components/mine/feedBack.vue')
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('../components/mine/help.vue')
  },
  {
    path: '/aboutUs',
    name: 'aboutUs',
    component: () => import('../components/mine/aboutUs.vue')
  },

  



]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
