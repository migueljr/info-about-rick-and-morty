import { createRouter, createWebHistory } from 'vue-router'
import Characters from '../views/Characters.vue'

const routes = [
  {
    path: '/',
    name: 'Characters',
    component: Characters
  },
  {
    path: '/episodes',
    name: 'Episodes',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Episodes.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
