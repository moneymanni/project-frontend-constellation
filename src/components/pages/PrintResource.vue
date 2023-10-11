<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <!-- <h1 class="h2">Dashboard</h1> -->
    <h1 class="h2"></h1>
    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group me-2">
        <button id="content" type="button" class="btn btn-sm btn-outline-secondary" @click="changeCpnContent">Content</button>
        <button id="graph" type="button" class="btn btn-sm btn-outline-secondary" @click="changeCpnGraph">Graph</button>
      </div>
      <!-- <button type="button" class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
        This week
      </button> -->
    </div>
  </div>
  <keep-alive>
    <component :is="selectedComponent"></component>
  </keep-alive>
</template>

<script>
import ResourceContent from './ResourceContent.vue'
import ResourceGraph from './ResourceGraph.vue'

export default {
  components: {
    ResourceContent,
    ResourceGraph
  },
  props: ['pageIsSelected'],
  emits: ['change-graph'],
  inject: ['showGraph'],
  data () {
    return {
      selectedComponent: 'resource-graph'
    }
  },
  watch: {
    pageIsSelected () {
      if (this.pageIsSelected === 'change') {
        this.changeCpnContent()
      } else if (!this.pageIsSelected) {
        this.changeCpnGraph()
      }
    }
  },
  methods: {
    changeCpnContent () {
      if (this.pageIsSelected) {
        this.selectedComponent = 'resource-content'
      }
    },
    changeCpnGraph () {
      this.selectedComponent = 'resource-graph'
      this.$emit('change-graph')
      this.showGraph()
    }
  }
}
</script>
