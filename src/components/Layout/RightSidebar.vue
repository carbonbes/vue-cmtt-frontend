<template>
  <div class="right-sidebar"></div>
</template>

<style>
.right-sidebar {
  position: sticky;
  top: 60px;
  width: 320px;
  height: calc(100vh - 60px);
  flex-shrink: 0;
}

@media screen and (max-width: 1539px) {
  .right-sidebar {
    display: none;
  }
}
</style>