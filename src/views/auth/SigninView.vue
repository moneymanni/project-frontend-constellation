<template>
  <section class="h-100">
    <base-modal :showClose="false" title="Please sign in" @close="handleClose">
      <form @submit.prevent="submitForm">
        <div class="form-floating mb-3">
          <input type="email" class="form-control rounded-3" id="email" placeholder="example@example.com" v-model.trim="email" />
          <label for="email">Email address</label>
        </div>

        <div class="form-floating mb-3">
          <input type="password" class="form-control rounded-3" id="password" placeholder="Password" v-model.trim="password">
          <label for="password">Password</label>
        </div>

        <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary">Sign in</button>
      </form>
      <p v-if="!formIsValid">사용자 정보가 틀렸습니다. 다시 입력해주세요.</p>
      <div class="d-grid d-sm-flex justify-content-sm-end px-2">
        <button type="button" class="btn btn-link" @click="goToSignup">Sign up</button>
      </div>

      <hr class="my-2">
      <h2 class="fs-5 fw-bold mb-4">Or use a third-party</h2>
      <button class="w-100 py-2 mb-2 btn btn-outline-primary rounded-3">
        <img class="bi me-1" alt="Kakao logo" width="22" height="22" src="../../assets/google-logo.png" />
        Sign in with Google
      </button>
      <button class="w-100 py-2 mb-1 btn btn-outline-warning rounded-3">
        <img class="bi me-1" alt="Kakao logo" width="22" height="22" src="../../assets/kakao-logo.png" />
        Sign in with Kakao
      </button>
    </base-modal>
  </section>
</template>

<script>
export default {
  name: 'SigninView',
  components: {},
  data () {
    return {
      isSignup: false,
      email: '',
      password: '',
      error: null,
      formIsValid: true,
      isLoading: false
    }
  },
  methods: {
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
        password: this.password
      }

      try {
        await this.$store.dispatch('login', actionPayload)
        const redirectUrl = '/' + (this.$route.query.redirect || 'notes')
        this.$router.replace(redirectUrl)
      } catch (error) {
        this.error = error.message || 'Failed to authenticate, try later.'
      }

      this.isLoading = false
    },
    handleClose () {},
    goToSignup () {
      return this.$router.push('/auth/signup')
    }
  }
}
</script>

<style scoped>
.modal-sheet .modal-dialog {
  width: 380px;
  padding-bottom: 2rem;
  /* transition: bottom .75s ease-in-out; */
}
</style>
