import { createStore } from 'vuex'

import authModule from './modules/auth/index'
import noteModule from './modules/notes/index'
import pageModule from './modules/pages/index'

export default createStore({
  modules: {
    auth: authModule,
    notes: noteModule,
    pages: pageModule
  }
})
