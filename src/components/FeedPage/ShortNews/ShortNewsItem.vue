<script setup>
import { computed } from "vue";
import CommentsIcon from "@/assets/logos/comment_icon.svg?inline";

// props
const props = defineProps(["item"]);

// computed
const articleId = props.item.id;
const title = computed(() => props.item.title);
const commentsCount = computed(() => props.item.counters.comments);
</script>

<template>
  <div class="news-content__item">
    <router-link
      :to="{ name: 'EntryPage', params: { id: articleId } }"
      class="link"
      v-text="title"
    ></router-link>
    <router-link
      :to="{
        name: 'EntryPage',
        params: { id: articleId },
        query: { comments: null },
      }"
      class="comments-count"
    >
      <CommentsIcon class="icon" />
      <div class="count" v-text="commentsCount"></div>
    </router-link>
  </div>
</template>