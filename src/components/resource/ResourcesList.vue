<template>
  <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="sidebarMenuLabel">Company name</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
    </div>
    
    <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">

      <button type="button" class="btn btn-outline-primary" @click="$emit('add-page')">Add Page</button>

      <p></p>

      <ul class="nav flex-column"
        v-for="note in notes" :key="note.id">
        <li class="nav-item" @click="$emit('select-page', note.id)">
          <button class="nav-link d-flex align-items-center gap-2 active" aria-current="page" >
            <img src="@/assets/page-icon.png" alt="Logo" width="18" height="18">
            {{note.title}}
          </button>
        </li>
        
      </ul>

    </div>
  </div>
</template>

<script>
export default {
  props: ['notes'],
  emits: ['select-page', 'add-page'],
}
</script>

<style scoped>
button {
  width: 200px;
  margin: auto;
}
</style>