<template>
  <div class="input-group mb-3">
    <input id="title" type="text" class="form-control" placeholder="Title" v-model="localPage.title" @change="$emit('change-header', localPage.title, localPage.keyword)" >
  </div>
  <div class="input-group mb-3">
    <input id="keyword" type="text" class="form-control" placeholder="Keyword" v-model="localPage.keyword" @change="$emit('change-header', localPage.title, localPage.keyword)" >
  </div>
  <div class="input-group mb-3">
    <input id="link" type="text" class="form-control" placeholder="Link" v-model="localPage.linkedPageKeyword" @change="$emit('update-link', localPage.id, localPage.linkedPageKeyword)" >
  </div>
  <div class="input-group mb-3">
    <input id="tag" type="text" class="form-control" placeholder="Tag" v-model="tag">
  </div>
  <div class="input-group">
    <textarea class="form-control" aria-label="With textarea" placeholder="Content" v-model="localPage.content" @change="$emit('change-content'), localPage.content" rows="20" ></textarea>
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
      localPage: { ...this.page }
    }
  },
  watch: {
    page: {
      deep: true,
      handler (newPage) {
        this.localPage = { ...newPage }
      }
    }
  }
  // methods: {
  //   createLink () {
  //     // 페이지 간 링크 생성
  //     // POST: http://localhost:5000/1/1/create-link
  //   },
  //   deleteLink () {
  //     // 페이지 간 링크 삭제
  //     // POST: http://localhost:5000/1/1/delete-link
  //   }
  // }
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
</style>
