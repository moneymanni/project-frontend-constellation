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
                <button type="button" class="btn btn-outline-primary" @click="changeNoteScreen">새 노트 생성</button>
              </div>
              <hr>
              <div class="list-grop px-4">
                <note-item
                  v-for="note in noteList"
                  :key="note.noteId"
                  :noteId="note.noteId"
                  :title="note.title"
                  :description="note.description"
                  :at="note.updatedAt ? note.updatedAt : note.createdAt"
                ></note-item>
              </div>
            </div>

            <div v-if="isCreatingNote" class="custom-height">
              <note-registration @switch-list="changeNoteScreen"></note-registration>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteItem from '@/components/notes/NoteItem.vue'
import NoteRegistration from '@/components/notes/NoteRegistration.vue'

export default {
  components: {
    NoteItem,
    NoteRegistration
  },
  data () {
    return {
      isCreatingNote: false,
      isLoding: false,
      error: null
    }
  },
  computed: {
    noteList () {
      return this.$store.getters['notes/noteList']
    }
  },
  created () {
    this.loadNoteList()
  },
  methods: {
    changeNoteScreen () {
      this.isCreatingNote = !this.isCreatingNote
      this.loadNoteList()
    },
    async loadNoteList () {
      try {
        await this.$store.dispatch('notes/loadNoteList')
      } catch (error) {
        this.error = error.message || 'Something went wrong!'
      }
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
