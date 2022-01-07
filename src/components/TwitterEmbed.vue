<template>
  <div class="embed">
    <div class="embed-header">
      <img class="embed-header__author-avatar" :src="authorAvatar" alt="" />
      <div class="embed-header__data">
        <span class="embed-header__author-name">{{ authorName }}</span>
        <span class="embed-header__author-tag">@{{ authorTag }}</span>
      </div>
      <div class="spacer" />
      <div class="embed-header__logo">
        <twitter-logo class="twitter-logo" />
      </div>
    </div>
    <div class="embed-text" v-html="text" v-if="text"></div>
    <div class="embed-cover" v-if="imgCover || videoCover">
      <img :src="imgCover" alt="" v-if="imgCover" />
      <video controls playsinline v-if="videoCover">
        <source :src="videoCover" />
      </video>
    </div>
  </div>
</template>

<script>
import TwitterLogo from "@/assets/logos/twitter_logo.svg?inline";

export default {
  props: {
    data: Object,
  },

  components: {
    TwitterLogo,
  },

  computed: {
    authorAvatar() {
      return this.data[0].data.tweet.data.tweet_data.user
        .profile_image_url_https;
    },

    authorName() {
      return this.data[0].data.tweet.data.tweet_data.user.name;
    },

    authorTag() {
      return this.data[0].data.tweet.data.tweet_data.user.screen_name;
    },

    text() {
      return this.data[0].data.tweet.data.tweet_data.processed_text;
    },

    imgCover() {
      if (
        Object.keys(this.data[0].data.tweet.data.tweet_data.extended_entities)
          .length !== 0 &&
        this.data[0].data.tweet.data.tweet_data.extended_entities.media &&
        this.data[0].data.tweet.data.tweet_data.extended_entities.media[0]
          .type === "photo"
      ) {
        return this.data[0].data.tweet.data.tweet_data.extended_entities
          .media[0]?.media_url_https;
      }
    },

    videoCover() {
      if (
        Object.keys(this.data[0].data.tweet.data.tweet_data.extended_entities)
          .length !== 0 &&
        this.data[0].data.tweet.data.tweet_data.extended_entities.media &&
        this.data[0].data.tweet.data.tweet_data.extended_entities.media[0]
          .type === "video"
      ) {
        return this.data[0].data.tweet.data.tweet_data.extended_entities.media[0].video_info.variants[0].url;
      }
    },
  },
};
</script>