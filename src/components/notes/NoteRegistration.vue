<template>
  <div class="fw-bold d-grid d-sm-flex justify-content-sm-end">
    생성 창 닫기
    <button type="button" class="btn-close" @click="clickClose"></button>
  </div>
  <hr>
  <form class="py-3 px-3" @submit.prevent="submitForm">
    <div class="mb-3">
      <label for="name" class="form-label">노트 이름</label>
      <input class="form-control" type="text" placeholder="제목없음" v-model.trim="title" />
    </div>
    <div class="mb-3">
      <label for="description" class="form-label">노트 설명</label>
      <textarea class="form-control" rows="7" v-model.trim="description"></textarea>
    </div>
    <button class="btn btn-primary btn-lg" type="submit">노트 생성</button>
  </form>
</template>

<script>
export default {
  emits: ['switch-list'],
  data () {
    return {
      title: '',
      description: '',
      isLoding: false,
      error: null
    }
  },
  methods: {
    async submitForm () {
      const data = {
        title: this.title,
        description: this.description
      }

      this.isLoading = true
      try {
        await this.$store.dispatch('notes/registerNote', data)
      } catch (error) {
        this.error = error.message || 'Something went wrong!'
      }
      this.isLoading = false

      this.clickClose()
      // this.$router.replace('/notes')
    },
    clickClose () {
      this.$emit('switch-list')
    }
  }
}
</script>

<style scoped>

</style>
