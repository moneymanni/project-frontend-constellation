let timer // eslint-disable-line no-unused-vars

export default {
  async auth (context, payload) {
    const mode = payload.mode
    let url = process.env.VUE_APP_URL + '/auth/sign-in'

    if (mode === 'signup') {
      url = process.env.VUE_APP_URL + '/user/sign-up'
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        profile: 'none'
      })
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.log(responseData)
      const error = new Error(responseData.message || 'Failed to authenticate')
      throw error
    }

    const expiresIn = +responseData.tokenExpiration * 1000
    const expirationData = new Date().getTime() + expiresIn

    localStorage.setItem('accessToken', responseData.accessToken)
    localStorage.setItem('userId', responseData.data.userId)
    localStorage.setItem('tokenExpiration', expirationData)

    timer = setTimeout(function () {
      context.dispatch('autoLogout')
    }, expiresIn)

    context.commit('setUser', {
      accessToken: responseData.accessToken,
      userId: responseData.data.userId
    })
  },
  async login (context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login'
    })
  },
  async signup (context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'signup'
    })
  },
  tryLogin (context) {
    const accessToken = localStorage.getItem('accessToken')
    const userId = localStorage.getItem('userId')
    const tokenExpiration = localStorage.getItem('tokenExpiration')

    const expiresIn = +tokenExpiration - new Date().getTime()

    if (expiresIn < 0) {
      return
    }

    timer = setTimeout(function () {
      context.dispatch('autoLogout')
    }, expiresIn)

    if (accessToken && userId) {
      context.commit('setUser', {
        accessToken: accessToken,
        userId: userId
      })
    }
  },
  logout (context) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('tokenExpiration')

    clearTimeout(timer)

    context.commit('setUser', {
      accessToken: null,
      userId: null,
      tokenExpiration: null
    })
  },
  autoLogout (context) {
    context.dispatch('logout')
    context.commit('setAutoLogout')
  }
}
