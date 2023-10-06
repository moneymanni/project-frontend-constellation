import mutations from './mutations.js'
import getters from './getters.js'
import actions from './actions.js'

export default {
  state () {
    return {
      userId: null,
      accessToken: null,
      didAutoLogout: false
    }
  },
  getters,
  mutations,
  actions
}
