<script setup>
import { computed } from "vue";
import ArticleTitle from "../ArticleTitle.vue";
import ArticleSubtitles from "./ArticleSubtitles/ArticleSubtitles.vue";
import ArticleMedia from "./ArticleMedia.vue";
import ArticleSocialEmbeds from "./ArticleSocialEmbeds.vue";
import ArticleLink from "./ArticleLink.vue";
import ArticleQuote from "./ArticleQuote.vue";

// props
const props = defineProps(["articleId", "title", "isEditorial", "content"]);

// computed
const subtitles = computed(() =>
  props.content.filter((block) => block.type === "text" && block.cover)
);
</script>

<template>
  <div class="article-component__content">
    <ArticleTitle
      :title="props.title"
      :isEditorial="props.isEditorial"
      v-if="props.title"
    />

    <ArticleSubtitles :subtitles="subtitles" v-if="subtitles.length" />

    <template v-for="(block, i) in props.content" :key="i">
      <ArticleMedia
        :media="block"
        v-if="block.cover && (block.type === 'media' || block.type === 'video')"
      />

      <ArticleSocialEmbeds
        :embed="block"
        v-if="
          block.cover && (block.type === 'telegram' || block.type === 'tweet')
        "
      />
      
      <ArticleLink :link="block" v-if="block.cover && block.type === 'link'" />
      <!-- <ArticleQuote :quote="block" v-if="block.cover && block.type === 'quote'" /> -->
    </template>

    <router-link
      class="link"
      :to="{ path: '/' + props.articleId }"
    ></router-link>
  </div>
</template>