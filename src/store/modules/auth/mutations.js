export default {
  setUser (state, payload) {
    state.accessToken = payload.accessToken
    state.userId = payload.userId
    state.didAutoLogout = false
  },
  setAutoLogout (state) {
    state.didAutoLogout = true
  }
}
