<script setup>
import ListItem from "./ListItem.vue";

// props
defineProps({
  items: Array,
});
</script>

<template>
  <div class="list-component">
    <ul>
      <ListItem v-for="(item, i) in items" :item="item" :key="i" />
    </ul>
  </div>
</template>

<style lang="scss">
.list-component {
  ul {
    padding-left: 16px;

    li {
      margin: 10px 0;
    }
  }
}

@media (max-width: 768px) {
  .list-component {
    ul {
      padding-left: 24px;
    }
  }
}
</style>