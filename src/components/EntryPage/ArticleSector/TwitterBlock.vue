<template>
  <div class="entry-page__twitter-block entry-page__embed">
    <twitter-component
      :authorAvatar="authorAvatar"
      :authorName="authorName"
      :authorTag="authorTag"
      :dateTime="datePublish"
      :text="text"
      :media="media"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import TwitterComponent from "@/components/TwitterComponent.vue";

// props
const props = defineProps({
  data: Object,
});

// computed
const authorAvatar = computed(
  () => props.data.tweet.data.tweet_data.user.profile_image_url_https
);

const authorName = computed(
  () => props.data.tweet.data.tweet_data.user.name
);

const authorTag = computed(
  () => props.data.tweet.data.tweet_data.user.screen_name
);

const datePublish = computed(
  () => props.data.tweet.data.tweet_data.created_at
);

const text = computed(
  () =>
    props.data.tweet.data.tweet_data.processed_text ||
    props.data.tweet.data.tweet_data.full_text
);

const media = computed(
  () => props.data.tweet.data.tweet_data.extended_entities.media
);
</script>