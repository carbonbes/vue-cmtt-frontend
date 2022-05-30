<script setup>
import { computed } from "vue";
import TwitterComponent from "../../TwitterComponent.vue";
import TelegramComponent from "../../TelegramComponent.vue";

// props
const props = defineProps(["embed"]);

// computed
const isTweet = computed(
  () => props.embed.cover && props.embed.type === "tweet"
);
const isTelegram = computed(
  () => props.embed.cover && props.embed.type === "telegram"
);

const tweetData = computed(() => {
  if (isTweet.value) {
    return {
      authorAvatar:
        props.embed.data.tweet.data.tweet_data.user.profile_image_url_https,
      authorName: props.embed.data.tweet.data.tweet_data.user.name,
      authorTag: props.embed.data.tweet.data.tweet_data.user.screen_name,
      dateCreated: props.embed.data.tweet.data.tweet_data.created_at,
      text: props.embed.data.tweet.data.tweet_data.processed_text,
      media: props.embed.data.tweet.data.tweet_data.extended_entities.media,
    };
  }
});
</script>

<template>
  <div class="socials-embed e-island" v-if="isTweet">
    <TwitterComponent
      :authorAvatar="tweetData.authorAvatar"
      :authorName="tweetData.authorName"
      :authorTag="tweetData.authorTag"
      :dateTime="tweetData.dateCreated"
      :text="tweetData.text"
      :media="tweetData.media"
    />
  </div>

  <div class="socials-embed e-island" v-if="isTelegram">
    <TelegramComponent
      :authorAvatarSrc="
        props.embed.data.telegram.data.tg_data.author.avatar_url
      "
      :authorName="props.embed.data.telegram.data.tg_data.author.name"
      :dateTime="props.embed.data.telegram.data.tg_data.datetime"
      :text="props.embed.data.telegram.data.tg_data.text"
      :imgCover="props.embed.data.telegram.data.tg_data.photos"
      :videoCover="props.embed.data.telegram.data.tg_data.videos[0]"
    />
  </div>
</template>