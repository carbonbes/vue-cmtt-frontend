<script setup>
import { computed } from "vue";

// props
const props = defineProps(["subtitle"]);

// computed
const subtitleFormatted = computed(() =>
  props.subtitle
    .replace(/\\/g, "")
    .replace(
      /(\[(.*?)\])\((https?\:\/\/.*?)\)/g,
      "<a href='$3' target='_blank'>$2</a>"
    )
);

const subtitleCollapsed = computed(() => {
  if (subtitleFormatted.value.length > 300) {
    return subtitleFormatted.value.slice(0, 250) + "...";
  }
});
</script>

<template>
  <p v-html="subtitleCollapsed || subtitleFormatted"></p>
</template>