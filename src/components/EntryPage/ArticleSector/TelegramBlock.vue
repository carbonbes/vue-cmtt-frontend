<template>
  <div class="entry-page__telegram-block entry-page__embed">
    <telegram-component
      :authorAvatarSrc="authorAvatarSrc"
      :authorName="authorName"
      :dateTime="datePublish"
      :text="text"
      :imgCover="images"
      :videoCover="videos[0]"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import TelegramComponent from "@/components/TelegramComponent.vue";

// props
const props = defineProps({
  data: Object,
});

// computed
const authorAvatarSrc = computed(
  () => props.data.telegram.data.tg_data.author.avatar_url
);

const authorName = computed(() => props.data.telegram.data.tg_data.author.name);

const datePublish = computed(() => props.data.telegram.data.tg_data.datetime);

const text = computed(() => props.data.telegram.data.tg_data.text);

const images = computed(() => props.data.telegram.data.tg_data.photos);

const videos = computed(() => props.data.telegram.data.tg_data.videos);
</script>