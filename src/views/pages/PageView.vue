<template>
  <the-header></the-header>
  <div class="container-fluid">
    <div class="row">
      <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
        <resources-list :pageList="this.$store.getters['pages/pageList']" @select-page="selectPage" @add-page="addPage"></resources-list>
      </div>

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
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
          <component
            :is="selectedComponent"
            :page="this.selectedPage"
            :graphElements="this.$store.getters['pages/graphElements']"
            @add-page="addPage"
            @change-header="changePageHeader"
            @change-content="changePageContent"
            @update-link="updateLink"
            @delete-page="deletePage"></component>
        </keep-alive>
      </main>
    </div>
  </div>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader.vue'
import ResourcesList from '@/components/pages/ResourcesList.vue'
import ResourceContent from '@/components/pages/ResourceContent.vue'
import ResourceGraph from '@/components/pages/ResourceGraph.vue'

export default {
  components: {
    TheHeader,
    ResourcesList,
    ResourceContent,
    ResourceGraph
  },
  props: ['noteId'],
  data () {
    return {
      selectedComponent: 'resource-graph',
      selectedPage: {
        id: null,
        title: '',
        keyword: '',
        tag: [],
        content: '',
        linkedPageId: null,
        linkedPageKeyword: ''
      },
      error: null
    }
  },
  async created () {
    this.setNoteId()
    await this.loadPageList()
    await this.loadNodeList()
    await this.loadEdgeList()
    this.$store.dispatch('pages/prepareGraphElements')
  },
  methods: {
    changeCpnContent () {
      if (this.selectedPage.id === null) {
        return
      }
      this.selectedComponent = 'resource-content'
      this.$store.dispatch('pages/prepareGraphElements')
    },
    changeCpnGraph () {
      this.selectedComponent = 'resource-graph'
      this.$store.dispatch('pages/prepareGraphElements')
    },
    selectPage (pageId) {
      const pageList = this.$store.getters['pages/pageList'] || []
      const nodeList = this.$store.getters['pages/nodeList'] || []
      const edgeList = this.$store.getters['pages/edgeList'] || []

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
      this.changeCpnContent()
    },
    async addPage (title, keyword, linkedPageKeyword) {
      const data = {
        title: title,
        keyword: keyword
      }

      await this.$store.dispatch('pages/addPage', data)

      await this.loadPageList()

      if (linkedPageKeyword) {
        const newPage = this.$store.getters['pages/pageList'].find(page => page.keyword === keyword)
        this.updateLink(newPage.pageId, linkedPageKeyword)
      }

      await this.loadNodeList()
      await this.loadEdgeList()
      this.$store.dispatch('pages/prepareGraphElements')
    },
    async changePageHeader (title, keyword) {
      await this.$store.dispatch('pages/changePageHeader', {
        pageId: this.selectedPage.id,
        title: title,
        keyword: keyword
      })

      await this.loadPageList()
      await this.loadNodeList()
      await this.loadEdgeList()
      await this.$store.dispatch('pages/prepareGraphElements')
    },
    async changePageContent (content) {
      await this.$store.dispatch('pages/changePageContent', {
        pageId: this.selectedPage.id,
        content: content
      })

      await this.loadPageList()
    },
    async deletePage () {
      await this.$store.dispatch('pages/deletePage', { pageId: this.selectedPage.id })

      await this.loadPageList()
      await this.loadNodeList()
      await this.loadEdgeList()
      this.$store.dispatch('pages/prepareGraphElements')
      this.changeCpnGraph()
    },
    async updateLink (pageId, linkedPageKeyword) {
      this.selectedPage.id = pageId
      this.selectedPage.linkedPageKeyword = linkedPageKeyword
      const nodeList = this.$store.getters['pages/nodeList']
      const edgeList = this.$store.getters['pages/edgeList']

      const identifiedNode = nodeList.find(node => node.keyword === this.selectedPage.linkedPageKeyword) // 검색한 키워드가 존재하는지?
      const identifiedEdge = edgeList.find(edge => edge.pageId === this.selectedPage.id) // 기존의 link가 존재하는지?

      if (identifiedNode && this.selectedPage.id === identifiedNode.pageId) {
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
            linkedPageId: identifiedEdge.linkedPageId,
            linkage: 1
          })
          await this.loadNodeList()
          await this.loadEdgeList()
          await this.$store.dispatch('pages/prepareGraphElements')
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
            linkedPageId: identifiedEdge.linkedPageId,
            linkage: 1
          })
          await this.loadNodeList()
          await this.loadEdgeList()
          await this.$store.dispatch('pages/prepareGraphElements')
        }
        this.$store.dispatch('pages/createLink', {
          pageId: this.selectedPage.id,
          linkedPageId: identifiedNode.pageId,
          linkage: 1
        })
        await this.loadNodeList()
        await this.loadEdgeList()
        await this.$store.dispatch('pages/prepareGraphElements')
      }
    },
    setNoteId () {
      this.$store.dispatch('pages/setNoteId', this.noteId)
    },
    async loadPageList () {
      try {
        await this.$store.dispatch('pages/loadPageList')
      } catch (error) {
        this.error = error.message || 'Something went wrong!'
      }
    },
    async loadNodeList () {
      try {
        await this.$store.dispatch('pages/loadNodeList')
      } catch (error) {
        this.error = error.message || 'Something went wrong!'
      }
    },
    async loadEdgeList () {
      try {
        await this.$store.dispatch('pages/loadEdgeList')
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
