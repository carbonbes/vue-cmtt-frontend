<script setup>
import ListComponent from "@/components/List/ListComponent.vue";

// props
defineProps({
  items: Array,
});
</script>

<template>
  <div class="ep-island">
    <div class="entry-page__list-block">
      <ListComponent :items="items" />
    </div>
  </div>
</template>