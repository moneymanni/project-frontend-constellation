<template>
  <the-header></the-header>
  <the-resources></the-resources>
</template>

<script>
import TheHeader from './components/layouts/TheHeader.vue'
import TheResources from './components/resource/TheResources.vue'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheResources,
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
  height: 100%;
}
</style>
