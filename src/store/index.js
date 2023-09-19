import { createStore } from 'vuex'

import authModule from './modules/auth/index'

export default createStore({
  modules: {
    auth: authModule
  },
  state () {
    return {

    }
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  }
})
