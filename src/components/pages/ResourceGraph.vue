<template>
  <h2>Network Graph</h2>
  <div id="cy"></div>
</template>

<script>
import cytoscape from 'cytoscape'
import coseBilkent from 'cytoscape-cose-bilkent'

export default {
  props: ['graphElements'],
  emits: ['add-page', 'change-component'],
  data () {
    return {
      cy: null
    }
  },
  mounted () {
    this.mountedGraph()
  },
  watch: {
    graphElements: {
      deep: true,
      handler () {
        this.mountedGraph()
      }
    }
  },
  methods: {
    mountedGraph () {
      cytoscape.use(coseBilkent)
      const cyContainer = document.getElementById('cy')

      this.cy = cytoscape({
        container: cyContainer,
        elements: this.graphElements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#666',
              label: 'data(keyword)' // 키워드로 라벨을 표시합니다.
            }
          },
          {
            selector: 'edge',
            style: {
              width: 3,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle'
            }
          }
        ],
        layout: {
          name: 'cose-bilkent',
          animate: false,
          gravityRangeCompound: 1.5,
          fit: true,
          tile: true
        },
        minZoom: 0.5,
        maxZoom: 3,
        zoom: 1
      })

      let addNodes = []
      let selectNode = null

      this.cy.on('cxttap', 'node', async (event) => {
        if (selectNode) {
          const nodeToRemove = addNodes
          nodeToRemove.forEach((label) => {
            const removeNode = this.cy.$(`#${label.id}`)
            removeNode.connectedEdges().remove()
            removeNode.remove()
          })
        }
        const keywordsId = addNodes.map(node => node.id)
        if (keywordsId.includes(event.target.id())) {
          // alert('Unable to link') 만약 에러 뜨면 alert로 처리
          this.$emit('add-page', event.target.data('keyword'), event.target.data('keyword'), selectNode.id)
          selectNode = null
          return
        } else if (!!selectNode && selectNode.id === event.target.id()) {
          selectNode = null
          return
        }
        // recommendKeywords
        await this.$store.dispatch('pages/recommendKeywords', event.target.data('keyword'))
        addNodes = this.$store.getters['pages/recommendKeywords']

        const node = event.target
        const nodesToAdd = addNodes
        const newNodes = []
        const newEdges = []

        nodesToAdd.forEach((label) => {
          const id = label.id
          newNodes.push({ data: { id: id, keyword: label.keyword } })
          newEdges.push({
            data: {
              id: `${node.id()}-${id}`,
              source: node.id(),
              target: id
            }
          })
        })

        this.cy.add(newNodes)
        this.cy.add(newEdges)

        newNodes.forEach(node => {
          this.cy.$(`#${node.data.id}`).style('background-color', '#87CEEB')
        })

        const eles = this.cy.elements()
        eles.layout({
          name: 'cose',
          fit: true,
          padding: 30,
          animate: false,
          animationDuration: 500,
          boundingBox: {
            x1: node.position().x - 150,
            y1: node.position().y - 150,
            w: 300,
            h: 300
          }
        }).run()

        selectNode = {
          id: event.target.id(),
          keyword: event.target.data('keyword')
        }
      })

      this.cy.on('tap', (event) => {
        if (selectNode && event.target.instanceString() === 'core') {
          selectNode = null
          const nodeToRemove = addNodes
          nodeToRemove.forEach((label) => {
            const removeNode = this.cy.$(`#${label.id}`)
            removeNode.connectedEdges().remove()
            removeNode.remove()
          })
        }
      })
    }
  }
}
</script>

<style scoped>
#cy {
  width: 100%;
  height: 48em;
}

.btn-group {
  z-index: 1000;
}
</style>
