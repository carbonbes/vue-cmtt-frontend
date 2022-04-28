<template>
  <div class="entry-page__gallery-block">
    <gallery-component :srcImages="images" type="entry_page" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import GalleryComponent from "@/components/Gallery/GalleryComponent.vue";

// props
const props = defineProps({
  images: Object,
});
</script>