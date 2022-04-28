<template>
  <a
    class="gallery__item"
    :href="itemImgSrc"
    :data-pswp-width="props.srcWidth"
    :data-pswp-height="props.srcHeight"
    target="_blank"
  >
    <img :src="itemImgPreview" />
  </a>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  srcImage: String,
  srcWidth: [Number, String],
  srcHeight: [Number, String],
});

const itemImgPreview = computed(() => {
  return `${props.srcImage}`;
});

const itemImgSrc = computed(() => {
  return `${props.srcImage}/-/resize/2500/`;
});
</script>