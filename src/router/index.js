import { createRouter, createWebHistory } from 'vue-router'
import NotesView from '../views/notes/NotesView.vue'
import PageView from '../views/pages/PageView.vue'

import store from '../store/index.js'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/notes'
  },
  {
    path: '/auth',
    name: 'auth',
    redirect: '/auth/signin',
    children: [
      {
        path: 'signin',
        name: 'signin',
        component: () => import('../views/auth/SigninView.vue'),
        meta: { requiresUnauth: true }
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('../views/auth/SignupView.vue'),
        meta: { requiresUnauth: true }
      }
    ]
  },
  {
    path: '/notes',
    name: 'notes',
    component: NotesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:noteId',
    name: 'page',
    component: PageView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(function (to, _, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth/signin')
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next('/notes')
  } else {
    next()
  }
})

export default router
