import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/vue-app',
  },
  {
    path: '/vue-app',
    name: 'Home',
    component: () => import('@/views/home'),
    children: [
      {
        path: '/vue-app',
        redirect: '/vue-app/about',
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/components/About'),
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

export default router
