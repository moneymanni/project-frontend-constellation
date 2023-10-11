<template>
  <h2>Network Graph</h2>
    <div id="cy"></div>
</template>

<script>
export default {
  inject: ['showGraph'],
  mounted () {
    this.showGraph()
  },
  updated () {
    this.showGraph()
  }
}
</script>

<style scoped>
#cy {
  width: 100%;
  height: 50em;
}
</style>
