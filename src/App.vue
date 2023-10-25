<template>
  <router-view/>
</template>

<script>
export default {
  computed: {
    didAutoLogout () {
      return this.$store.getters.didAutoLogout
    }
  },
  created () {
    this.$store.dispatch('tryLogin')
  },
  watch: {
    didAutoLogout (curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace('/coaches')
      }
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  width: 100vw;
  height: 100vh;
}

.bi {
  display: inline-block;
  width: 1rem;
  height: 1rem;
}

html,
body {
  width: 100%;
  height: 100%;
}

.container-fluid,
.row {
  /* height: 94.8vh; */
  height: 100%;
}

/* html,
body,
#app {
  height: 100%;
} */
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */
</style>
