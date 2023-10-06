let timer // eslint-disable-line no-unused-vars

export default {
  async auth (context, payload) {
    const mode = payload.mode
    let url = ''

    if (mode === 'signup') {
      url = ''
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password
      })
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.log(responseData)
      const error = new Error(responseData.message || 'Failed to authenticate')
      throw error
    }

    const expiresIn = +responseData.expiresIn * 1000
    const expirationData = new Date().getTime() + expiresIn

    localStorage.setItem('accessToken', responseData.accessToken)
    localStorage.setItem('userId', responseData.userId)
    localStorage.setItem('tokenExpiration', expirationData)

    timer = setTimeout(function () {
      context.dispatch('autoLogout')
    }, expiresIn)

    context.commit('setUser', {
      token: responseData.accessToken,
      userId: responseData.userId
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
