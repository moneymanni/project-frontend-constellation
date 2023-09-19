<template>
  <section>
    <base-modal :showClose="isSignup" title="Sign up" @close="handleClose">
      <form @submit.prevent="submitForm">
        <div class="form-floating mb-3">
          <input type="email" class="form-control rounded-3" id="floatingInput" placeholder="name@example.com">
          <label for="floatingInput">Email address</label>
        </div>

        <div class="form-floating mb-3">
          <input type="password" class="form-control rounded-3" id="floatingPassword" placeholder="Password">
          <label for="floatingPassword">Password</label>
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
      isSignup: true
    }
  },
  methods: {
    handleClose () {
      return this.$router.push('/auth/signin')
    }
  }
}
</script>
