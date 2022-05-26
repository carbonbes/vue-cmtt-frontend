<script setup>
import ArticleSubtitle from "./ArticleSubtitle.vue";

// props
const props = defineProps(["subtitles"]);
</script>

<template>
  <div class="subtitle e-island">
    <ArticleSubtitle
      v-for="subtitle in props.subtitles"
      :key="subtitle.data.text"
      :subtitle="subtitle.data.text"
    />
  </div>
</template>