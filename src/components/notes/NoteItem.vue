<template>
  <div class="list-group-item list-group-item-action d-flex gap-3 py-3" @click.prevent="handleClick">
    <img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
    <div class="d-flex gap-2 w-100 justify-content-between">
      <div>
        <h6 class="mb-0">{{title}}</h6>
        <p class="mb-0 opacity-75">{{description}}</p>
      </div>
      <small class="opacity-50 text-nowrap">
        <div>{{at}}</div>
      </small>
    </div>
  </div>
</template>

<script>
export default {
  props: ['noteId', 'title', 'description', 'at'],
  emits: ['itemClicked'],
  methods: {
    handleClick () {
      this.$router.push(`/${this.noteId}`)
    }
  }
}
</script>

<style scoped>
.list-group-item {
  cursor: pointer;
  border-radius: .5rem;
}

.list-group-item:hover,
.list-group-item:focus {
  background-color: var(--bs-secondary-bg);
}
</style>
