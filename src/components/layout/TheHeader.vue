<template>
  <header class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
    <div class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" @click="moveNote">
      <img src="@/assets/stars-icon.png" alt="Logo" width="30" height="24">
      Constellation
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    moveNote () {
      const redirectUrl = '/' + (this.$route.query.redirect || 'notes')
      this.$router.replace(redirectUrl)
    }
  }
}
</script>

<style scoped>
.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}
</style>
