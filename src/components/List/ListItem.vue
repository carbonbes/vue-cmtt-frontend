<script setup>
import { computed } from "vue";

// props
const props = defineProps({
  item: String,
});

// computed
const processedItem = computed(() =>
  props.item.replace(
    /(\[(.+?)\])\((https?\:\/\/.+?)\)/g,
    "<a href='$3' target='_blank'>$2</a>"
  )
);
</script>

<template>
  <li v-html="processedItem"></li>
</template>