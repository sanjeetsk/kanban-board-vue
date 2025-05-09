// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Board from '../views/Board.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/board',
    name: 'Board',
    component: Board,
    meta: { requiresAuth: true },
  },
  // Add more routes as needed
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Check if route needs auth
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
