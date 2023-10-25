<template>
  <h2>Network Graph</h2>
  <div id="cy"></div>
  <div
    v-if="showMenu"
    :style="{ top: buttonBoxTop + 170 + 'px', left: buttonBoxLeft + 340 + 'px' }"
    class="box list-group">
    <div class="list-group-item list-group-item-action" @click="recommend('association')">연관성으로 추천</div>
    <div class="list-group-item list-group-item-action" @click="recommend('trend')">트랜드로 추천</div>
  </div>
  <div
    v-if="showNodeInfoCard"
    class="card box"
    :style="{ top: buttonBoxTop + 170 + 'px', left: buttonBoxLeft + 340 + 'px', width: '30rem' }">
    <div class="card-body">
      <h3 class="card-title">{{miniPage.title}}<h6>keyword: {{miniPage.keyword}}</h6></h3>
      <div class="d-inline-block" v-for="link in miniPage.link" :key="link.linkedPageId">
        <span class="badge rounded-pill text-bg-primary me-1" style="max-width: 18rem; word-wrap: break-word;">{{link.linkedPageKeyword}}</span>
      </div>
      <p></p>
      <p class="card-text">{{miniPage.content}}</p>
    </div>
  </div>
</template>

<script>
import cytoscape from 'cytoscape'
import coseBilkent from 'cytoscape-cose-bilkent'

export default {
  props: ['graphElements'],
  emits: ['add-page', 'change-component'],
  data () {
    return {
      cy: null,
      showMenu: false,
      showNodeInfoCard: false,
      buttonBoxTop: 0,
      buttonBoxLeft: 0,
      node: {
        id: null,
        keyword: '',
        x: null,
        y: null
      },
      miniPage: {
        id: null,
        title: '',
        keyword: '',
        link: [],
        content: ''
      }
    }
  },
  mounted () {
    this.mountedGraph()
  },
  computed: {
  },
  watch: {
    graphElements: {
      deep: true,
      handler () {
        this.mountedGraph()
      }
    },
    async showNodeInfoCard () {
      await this.updateCard()
    }
  },
  methods: {
    async updateCard () {
      this.miniPage = {
        id: null,
        title: '',
        keyword: '',
        link: [],
        content: ''
      }

      const pageList = this.$store.getters['pages/pageList'] || []

      const identifiedPage = pageList.find(page => String(page.pageId) === String(this.node.id))
      this.miniPage.id = identifiedPage.pageId
      if (identifiedPage.title === '') {
        this.miniPage.title = '제목 없음'
      } else {
        this.miniPage.title = identifiedPage.title
      }
      this.miniPage.keyword = identifiedPage.keyword
      if (identifiedPage.content === '') {
        this.miniPage.content = '내용 없음'
      } else {
        this.miniPage.content = identifiedPage.content
      }

      const url = 'http://127.0.0.1:5000/link/list-on-page?pageId=' + this.node.id
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          accessToken: this.$store.getters.accessToken
        }
      })

      const responseData = await response.json()

      if (!response.ok) {
        const error = new Error(responseData.message || 'Failed to fetch!')
        throw error
      }
      for (const item of responseData.data.linkList) {
        const link = {
          pageId: item.pageId,
          linkedPageId: item.linkedPageId,
          linkage: item.linkage
        }
        const linkedPage = pageList.find(page => page.pageId === item.linkedPageId)
        if (linkedPage) {
          link.linkedPageKeyword = linkedPage.keyword
        } else {
          link.linkedPageKeyword = ''
        }
        this.miniPage.link.push(link)
      }
    },
    async recommend (mode) {
      this.showMenu = false

      document.addEventListener('contextmenu', function (e) {
        e.preventDefault()
      })

      try {
        await this.$store.dispatch('pages/recommendKeywords', {
          node: this.node,
          mode: mode
        })
      } catch (error) {
        this.error = error.message || 'Something went wrong!'
        alert('추천 실패.')
        return
      }
      this.addNodes()
    },
    addNodes () {
      const recommendKeywords = this.$store.getters['pages/recommendKeywords']

      const newNodes = []
      const newEdges = []

      recommendKeywords.forEach(keywordObj => {
        const angle = 2 * Math.PI * Math.random()
        const distance = 100

        const newPosition = {
          x: this.node.x + distance * Math.cos(angle),
          y: this.node.y + distance * Math.sin(angle)
        }
        newNodes.push({
          data: {
            id: keywordObj.id,
            keyword: keywordObj.keyword
          },
          position: newPosition,
          style: {
            'background-color': '#87CEEB'
          }
        })
        newEdges.push({
          data: {
            id: `${this.node.id}-${keywordObj.id}`,
            source: this.node.id,
            target: keywordObj.id
          }
        })
      })

      this.cy.add(newNodes)
      this.cy.add(newEdges)
    },
    removeNodes () {
      if (this.node.id) {
        const nodeToRemove = this.$store.getters['pages/recommendKeywords']
        nodeToRemove.forEach((label) => {
          const removeNode = this.cy.$(`#${label.id}`)
          removeNode.connectedEdges().remove()
          removeNode.remove()
        })
      }
    },
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

      this.cy.on('cxttap', 'node', async (event) => {
        this.removeNodes()

        this.showMenu = true

        const node = event.target
        const pos = node.position()
        this.node = {
          id: node.id(),
          keyword: event.target.data('keyword'),
          x: pos.x,
          y: pos.y
        }

        const position = node.renderedPosition()
        this.buttonBoxTop = position.y
        this.buttonBoxLeft = position.x
      })

      this.cy.on('cxttap', (event) => {
        this.removeNodes()
        this.showNodeInfoCard = false
      })

      this.cy.on('tap', 'node', (event) => {
        this.removeNodes()
        this.showMenu = false

        const keywordsId = this.$store.getters['pages/recommendKeywords'].map(node => node.id)
        if (keywordsId.includes(event.target.id())) {
          this.$emit('add-page', event.target.data('keyword'), event.target.data('keyword'), this.node.id)
          return
        }

        const node = event.target

        if (this.showNodeInfoCard === false && this.miniPage.id === node.id()) {
          this.showNodeInfoCard = false
          return
        }

        const pos = node.position()
        this.node = {
          id: node.id(),
          keyword: event.target.data('keyword'),
          x: pos.x,
          y: pos.y
        }

        const position = node.renderedPosition()
        this.buttonBoxTop = position.y
        this.buttonBoxLeft = position.x

        this.showNodeInfoCard = true
        this.updateCard()
      })

      this.cy.on('tap', (event) => {
        this.removeNodes()
        if (event.target.instanceString() === 'core') {
          this.showMenu = false
          this.showNodeInfoCard = false
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

.box {
  position: absolute;
  padding: 10px;
}
</style>
