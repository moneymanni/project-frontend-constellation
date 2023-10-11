<template>
  <the-header></the-header>
  <div class="container-fluid">
    <div class="row">
      <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
        <resources-list :pageList="this.$store.getters['pages/pageList']" @select-page="selectPage" @add-page="addPage"></resources-list>
      </div>
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <print-resource :pageIsSelected="pageIsSelected" @change-graph="changeGraph"></print-resource>
      </main>
    </div>
  </div>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader.vue'
import PrintResource from '@/components/pages/PrintResource.vue'
import ResourcesList from '@/components/pages/ResourcesList.vue'
import cytoscape from 'cytoscape'

export default {
  components: {
    TheHeader,
    PrintResource,
    ResourcesList
  },
  provide () {
    return {
      page: this.selectedPage,
      changeHeader: this.changePageHeader,
      changeContent: this.changePageContent,
      deletePage: this.deletePage,
      updateLink: this.updateLink,
      showGraph: this.showGraph
    }
  },
  props: ['noteId'],
  data () {
    return {
      pageIsSelected: 'graph',
      selectedPage: {
        id: null,
        title: '',
        keyword: '',
        content: '',
        linkedPageId: null,
        linkedPageKeyword: ''
      },
      error: null
    }
  },
  created () {
    this.setNoteId()
    this.loadPageList()
    this.loadNodeList()
    this.loadEdgeList()
  },
  methods: {
    selectPage (pageId) {
      const pageList = this.$store.getters['pages/pageList'] || []
      const nodeList = this.$store.getters['pages/nodeList'] || []
      const edgeList = this.$store.getters['pages/edgeList'] || []

      this.pageIsSelected = 'change'
      const identifiedPage = pageList.find(page => page.pageId === pageId)
      this.selectedPage.id = identifiedPage.pageId
      this.selectedPage.title = identifiedPage.title
      this.selectedPage.keyword = identifiedPage.keyword
      this.selectedPage.content = identifiedPage.content

      const identifiedEdge = edgeList.find(edge => edge.pageId === pageId)
      if (identifiedEdge) {
        const edgeName = nodeList.find(node => node.pageId === identifiedEdge.linkedPageId)
        this.selectedPage.linkedPageId = identifiedEdge.linkedPageId
        this.selectedPage.linkedPageKeyword = edgeName.keyword
      } else {
        this.selectedPage.linkedPageId = null
        this.selectedPage.linkedPageKeyword = ''
      }
    },
    async addPage () {
      await this.$store.dispatch('pages/addPage').then((response) => {
        this.loadPageList()
        this.loadNodeList()
        this.$store.dispatch('pages/prepareGraphElements')
      })
    },
    async changePageHeader () {
      await this.$store.dispatch('pages/changePageHeader', {
        pageId: this.selectedPage.id,
        title: this.selectedPage.title,
        keyword: this.selectedPage.keyword
      }).then((response) => {
        this.loadPageList()
        this.loadEdgeList()
        this.$store.dispatch('pages/prepareGraphElements')
      })
    },
    async changePageContent () {
      await this.$store.dispatch('pages/changePageContent', {
        pageId: this.selectedPage.id,
        content: this.selectedPage.content
      }).then((response) => {
        this.loadPageList()
      })
    },
    async deletePage () {
      await this.$store.dispatch('pages/deletePage', { pageId: this.selectedPage.id }).then((response) => {
        this.loadPageList()
        this.loadNodeList()
        this.$store.dispatch('pages/prepareGraphElements')
      })
      this.pageIsSelected = 'graph'
    },
    async updateLink () {
      const nodeList = this.$store.getters['pages/nodeList']
      const edgeList = this.$store.getters['pages/edgeList']

      const identifiedNode = nodeList.find(node => node.keyword === this.selectedPage.linkedPageKeyword) // 검색한 키워드가 존재하는지?
      const identifiedEdge = edgeList.find(edge => edge.pageId === this.selectedPage.id) // 기존의 link가 존재하는지?

      if (this.selectedPage.id === identifiedNode.pageId) {
        alert('Unable to link')
        if (identifiedEdge) {
          const nodeInfo = nodeList.find(node => node.pageId === identifiedEdge.linkedPageId)
          this.selectedPage.linkedPageKeyword = nodeInfo.keyword
        } else {
          this.selectedPage.linkedPageKeyword = ''
        }
      }

      if (this.selectedPage.linkedPageKeyword === '' || !this.selectedPage.linkedPageKeyword) {
        if (identifiedEdge) {
          this.$store.dispatch('pages/deleteLink', {
            pageId: this.selectedPage.id,
            linkedPageId: identifiedEdge.linkedPageId
          }).then((response) => {
            this.loadEdgeList()
            this.$store.dispatch('pages/prepareGraphElements')
          })
        }
        return
      }

      if (!identifiedNode) {
        alert('not exist')

        if (identifiedEdge) {
          const nodeInfo = nodeList.find(node => node.pageId === identifiedEdge.linkedPageId)
          this.selectedPage.linkedPageKeyword = nodeInfo.keyword
        } else {
          this.selectedPage.linkedPageKeyword = ''
        }
      } else {
        if (identifiedEdge) {
          this.$store.dispatch('pages/deleteLink', {
            pageId: this.selectedPage.id,
            linkedPageId: identifiedEdge.linkedPageId
          }).then((response) => {
            this.loadEdgeList()
            this.$store.dispatch('pages/prepareGraphElements')
          })
        }
        this.$store.dispatch('pages/createLink', {
          pageId: this.selectedPage.id,
          linkedPageId: identifiedNode.pageId,
          linkage: 1
        }).then((response) => {
          this.loadEdgeList()
          this.$store.dispatch('pages/prepareGraphElements')
        })
      }
    },
    async showGraph () {
      await this.$store.dispatch('pages/prepareGraphElements')
      const elements = this.$store.getters['pages/graphElements']

      cytoscape({
        container: document.getElementById('cy'),
        elements: elements,
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
          name: 'grid',
          rows: 3
        }
      })
    },
    setNoteId () {
      this.$store.dispatch('pages/setNoteId', this.noteId)
    },
    loadPageList () {
      try {
        this.$store.dispatch('pages/loadPageList')
      } catch (error) {
        this.error = error.message || 'Something went wrong!'
      }
    },
    loadNodeList () {
      try {
        this.$store.dispatch('pages/loadNodeList')
      } catch (error) {
        this.error = error.message || 'Something went wrong!'
      }
    },
    loadEdgeList () {
      try {
        this.$store.dispatch('pages/loadEdgeList')
      } catch (error) {
        this.error = error.message || 'Something went wrong!'
      }
    }
    // async loadPageList () {
    //   try {
    //     await this.$store.dispatch('pages/loadPageList')
    //   } catch (error) {
    //     this.error = error.message || 'Something went wrong!'
    //   }
    // },
    // async loadNodeList () {
    //   try {
    //     await this.$store.dispatch('pages/loadNodeList')
    //   } catch (error) {
    //     this.error = error.message || 'Something went wrong!'
    //   }
    // },
    // async loadEdgeList () {
    //   try {
    //     await this.$store.dispatch('pages/loadEdgeList')
    //   } catch (error) {
    //     this.error = error.message || 'Something went wrong!'
    //   }
    // }
  }
  // mounted () {
  //   this.loadPageList()
  //   this.loadNodeList()
  //   this.loadEdgeList()
  // }
}
</script>

<style scoped>
.sidebar {
  font-size: .875rem;
  font-weight: 500;
  color: #2470dc;
}
</style>
