<script setup>
import { computed } from "vue";
import EntryTitle from "../EntryTitle.vue";
import EntrySubtitle from "../EntrySubtitle.vue";
import ImageComponent from "@/components/ImageComponent.vue";
import VideoComponent from "@/components/VideoComponent.vue";

// props
const props = defineProps(["isEditorial", "title", "subtitles", "content"]);

// computed
</script>

<template>
  <div class="article-component__content">
    <EntryTitle :title="props.title" :isEditorial="props.isEditorial" />
    <EntrySubtitle />
  </div>
</template>

<style lang="scss">
</style>