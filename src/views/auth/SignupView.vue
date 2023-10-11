<template>
  <section>
    <base-modal :showClose="isSignup" title="Sign up" @close="handleClose">
      <form @submit.prevent="submitForm">
        <div class="form-floating mb-3">
          <input type="email" class="form-control rounded-3" id="email" placeholder="example@example.com" v-model.trim="email">
          <label for="email">Email address</label>
        </div>

        <div class="form-floating mb-3">
          <input type="password" class="form-control rounded-3" id="password" placeholder="Password" v-model.trim="password">
          <label for="password">Password</label>
        </div>

        <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">Sign up</button>
        <small class="text-body-secondary">By clicking Sign up, you agree to the terms of use.</small>
      </form>
    </base-modal>
  </section>
</template>

<script>
export default {
  name: 'SignupView',
  components: {},
  data () {
    return {
      isSignup: true,
      email: '',
      password: '',
      error: null,
      formIsValid: true,
      isLoading: false
    }
  },
  methods: {
    handleClose () {
      return this.$router.push('/auth/signin')
    },
    async submitForm () {
      // this.formIsValid = true
      // if (
      //   this.email === '' ||
      //   !this.email.includes('@') ||
      //   this.password.length < 6
      // ) {
      //   this.formIsValid = false
      //   return
      // }

      this.isLoading = true

      const actionPayload = {
        email: this.email,
        password: this.password,
        profile: ''
      }

      try {
        await this.$store.dispatch('signup', actionPayload)
        const redirectUrl = '/' + (this.$route.query.redirect || 'notes')
        this.$router.replace(redirectUrl)
      } catch (error) {
        this.error = error.message || 'Failed to authenticate, try later.'
      }

      this.isLoading = false
    }
  }
}
</script>
