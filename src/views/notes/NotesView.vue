<template>
  <div class="container py-5 h-100">
    <div class="border border-dark-subtle h-100">
      <div class="d-flex flex-nowrap h-100">
        <div class="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary" style="width: 280px;">
          <ul class="nav nav-pills flex-column mb-auto py-4">
            <li class="mb-3">
              <a href="#" class="nav-link link-body-emphasis">
                Dashboard
              </a>
            </li>
            <li class="mb-3">
              <a href="#" class="nav-link link-body-emphasis">
                <!-- <svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#table"/></svg> -->
                Orders
              </a>
            </li>
            <li class="mb-3">
              <a href="#" class="nav-link link-body-emphasis">
                <!-- <svg class="bi pe-none me-2" width="16" height="16"><use xlink:href="#grid"/></svg> -->
                Products
              </a>
            </li>
          </ul>
        </div>

        <div class="flex-fill text-center">
          <div class="py-4 mb-auto h-100">
            <img class="d-block mx-auto mb-4" src="../../assets/stars-icon.png" alt width="100" height="100" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-toggle-nav a {
  padding: .1875rem .5rem;
  margin-top: .125rem;
  margin-left: 1.25rem;
}
.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
  background-color: var(--bs-tertiary-bg);
}

dropdown-toggle {
  outline: 0;
}
</style>
