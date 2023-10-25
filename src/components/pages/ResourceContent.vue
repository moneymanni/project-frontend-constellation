<template>
  <div class="input-group mb-3">
    <input id="title" type="text" class="form-control" placeholder="Title" v-model="localPage.title" @input="updateKeyword" @change="$emit('change-header', localPage.title, localPage.keyword)" >
  </div>
  <div class="input-group mb-3">
    <input id="keyword" type="text" class="form-control" placeholder="Keyword" v-model="localPage.keyword" @change="$emit('change-header', localPage.title, localPage.keyword)" >
  </div>
  <!-- <div class="input-group">
    <input id="link" type="text" class="form-control" placeholder="Link" v-model="localPage.linkedPageKeyword" @change="$emit('update-link', localPage.id, localPage.linkedPageKeyword)" >
  </div> -->
  <div class="dropdown mb-3" data-bs-theme="light">
    <div class="input-group">
      <button class="form-control btn btn-outline-secondary button-text-left" type="button" data-bs-toggle="dropdown">
        {{buttonText}}
        <div class="d-inline-block" v-for="page in localPage.linkedPage" :key="page.id">
          <span class="badge rounded-pill text-bg-primary me-1" @click="$emit('update-link', localPage.id, page.linkedPageId)">{{page.linkedPageKeyword}} x</span>
        </div>
      </button>
      <div class="dropdown-menu pt-0 mx-0 rounded-3 shadow overflow-hidden w-280px" data-bs-theme="light">
        <div class="p-2 mb-2 bg-body-tertiary border-bottom">
          <input type="search" class="form-control" autocomplete="false" placeholder="Type to filter..." v-model="filterLink">
        </div>
        <ul class="list-unstyled mb-0" v-for="node in filteredNodeList" :key="node.id">
          <li><div class="dropdown-item d-flex align-items-center gap-2 py-2" @click="$emit('update-link', localPage.id, node.pageId)">
            <span class="d-inline-block bg-primary rounded-circle p-1"></span>
            {{node.keyword}}
          </div></li>
        </ul>
      </div>
    </div>
  </div>

  <!-- <div class="input-group mb-3">
    <input id="tag" type="text" class="form-control" placeholder="Tag" v-model="tag">
  </div> -->
  <div class="input-group">
    <textarea class="form-control" aria-label="With textarea" placeholder="Content" v-model="localPage.content" @change="$emit('change-content', localPage.content)" rows="20" ></textarea>
  </div>
  <p></p>
  <button type="button" class="btn btn-outline-primary" @click="$emit('delete-page')">Delete</button>
</template>

<script>
export default {
  props: ['page'],
  emits: ['change-header', 'change-content', 'update-link', 'delete-page'],
  data () {
    return {
      localPage: { ...this.page },
      filterLink: '',
      titleAndKeywordAreSame: true
    }
  },
  computed: {
    filteredNodeList () {
      const linkedPageKeywords = this.localPage.linkedPage.map(link => link.linkedPageKeyword)
      return this.$store.getters['pages/nodeList'].filter(node =>
        node.keyword &&
        node.keyword !== this.localPage.keyword &&
        node.keyword.includes(this.filterLink) &&
        !linkedPageKeywords.includes(node.keyword)
      )
    },
    buttonText () {
      if (this.localPage.linkedPage.length === 0) {
        return 'Link'
      }
      return ''
    }
  },
  watch: {
    page: {
      deep: true,
      handler (newPage) {
        this.localPage = { ...newPage }
      }
    },
    'localPage.keyword': {
      handler () {
        if (this.localPage.keyword === this.localPage.title) {
          this.titleAndKeywordAreSame = true
        } else {
          this.titleAndKeywordAreSame = false
        }
      }
    },
    'localPage.title': {
      handler () {
        if (this.localPage.keyword === this.localPage.title) {
          this.titleAndKeywordAreSame = true
        }
      }
    }
  },
  methods: {
    updateKeyword () {
      if (this.titleAndKeywordAreSame) {
        this.localPage.keyword = this.localPage.title
      }
    },
    clickSpan (keyword) {
      console.log(keyword)
    }
  }
}
</script>

<style scoped>
textarea {
  width: 100%;

  /* border: none; */
  resize: none;
}
button {
  float: right
}
.button-text-left {
  text-align: left;
}
</style>
