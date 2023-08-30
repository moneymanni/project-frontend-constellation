<template>
  <h2>Network Graph</h2>
  <p>{{node}}</p>
  <p>{{edge}}</p>
    <div id="cy"></div>
</template>

<script>
export default {
  inject: ['showGraph', 'nodes', 'edges'],
  mounted() {
    this.showGraph();
  }
}
</script>

<style scoped>
#cy {
  width: 100%;
  height: 50em;
}
</style>