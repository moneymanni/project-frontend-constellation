<template>
  <div class="modal modal-sheet position-static d-block p-4 py-md-5" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header p-5 pb-4 border-bottom-0">
          <h1 class="fw-bold mb-0 fs-2">{{ title }}</h1>
          <button v-if="showClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body p-5 pt-0">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showClose: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.modal-sheet .modal-dialog {
  width: 380px;
  padding-bottom: 2rem;
  /* transition: bottom .75s ease-in-out; */
}
</style>
