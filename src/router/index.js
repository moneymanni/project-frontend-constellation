import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import AuthView from '../views/auth/AuthView.vue'
import NotesView from '../views/notes/NotesView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/auth',
    name: 'auth',
    // component: AuthView,
    redirect: '/auth/signin',
    children: [
      {
        path: 'signin',
        name: 'signin',
        component: () => import('../views/auth/SigninView.vue')
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('../views/auth/SignupView.vue')
      }
    ]
  },
  {
    path: '/notes',
    name: 'notes',
    component: NotesView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
