<script setup>
import { computed } from "vue";
import ArticleHeader from "./ArticleHeader.vue";
import NewEntryContent from "./EntryContent/NewEntryContent.vue";
import EntryFooter from "./EntryFooter.vue";

// props
const props = defineProps(["article"]);

// computed
const isEditorial = computed(() => props.article.isEditorial);
const articleTitle = computed(() => props.article.title);
const articleSubtitles = computed(() =>
  props.article.blocks.filter((block) => block.type === "text" && block.cover)
);
const articleContent = computed(() => props.article.blocks);
</script>

<template>
  <div class="article-component">
    <ArticleHeader :article="props.article" dateType="0" />
    <NewEntryContent
      :isEditorial="isEditorial"
      :title="articleTitle"
      :subtitles="articleSubtitles"
      :content="articleContent"
    />
    <EntryFooter />
  </div>
</template>

<style lang="scss">
</style>