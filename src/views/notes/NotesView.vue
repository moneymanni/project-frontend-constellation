<template>
  <div class="container py-5 h-100">
    <div class="border border-dark-subtle h-100">
      <div class="d-flex h-100">

        <div class="flex-fill py-5">
          <div class="py-4 px-5 mb-auto h-100">
            <div class="fs-1 fw-bold text-center">
              <img class="d-block mx-auto mb-4" src="../../assets/stars-icon.png" alt width="100" height="100" />
              Mind Web
            </div>
            <p class="fw-bold text-center">version 0.0.3</p>
            <br>

            <div v-if="!isCreatingNote" class="custom-height" style="overflow:auto;">
              <div class="fw-bold px-4 d-grid d-sm-flex justify-content-sm-end">
                <button type="button" class="btn btn-outline-primary" @click="createNote">새 노트 생성</button>
              </div>
              <hr>
              <div class="list-grop px-4">
                <note-item></note-item>
              </div>
            </div>

            <div v-if="isCreatingNote" class="custom-height">
              <div class="fw-bold d-grid d-sm-flex justify-content-sm-end">
                생성 창 닫기
                <button type="button" class="btn-close" @click="createNote"></button>
              </div>
              <hr>
              <form class="py-3 px-3">
                <div class="mb-3">
                  <label for="name" class="form-label">노트 이름</label>
                  <input class="form-control" type="text" placeholder="제목없음" />
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">노트 설명</label>
                  <textarea class="form-control" rows="7"></textarea>
                </div>
                <button class="btn btn-primary btn-lg" type="submit">노트 생성</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteItem from '@/components/notes/NoteItem.vue'

export default {
  components: {
    NoteItem
  },
  data () {
    return {
      isCreatingNote: false
    }
  },
  methods: {
    createNote () {
      this.isCreatingNote = !this.isCreatingNote
    }
  }
}
</script>

<style scoped>
.custom-height {
  height: 70%;
}

.list-group {
  width: 100%;
  max-width: 460px;
  margin-inline: 1.5rem;
}

</style>
