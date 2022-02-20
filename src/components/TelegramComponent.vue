<template>
  <div class="embed">
    <div class="embed-header">
      <img class="embed-header__author-avatar" :src="authorAvatar" alt="" />
      <div class="embed-header__data">
        <span class="embed-header__author-name">{{ authorName }}</span>
        <date-time
          :date="dateTime * 1000"
          :type="1"
          :title="new Date(dateTime * 1000).toLocaleString()"
        />
      </div>
      <div class="spacer" />
      <div class="embed-header__logo">
        <telegram-logo class="telegram-logo" />
      </div>
    </div>
    <div class="embed-text" v-html="text" v-if="text"></div>
    <div class="embed-cover" v-if="imgCover || videoCover">
      <img :src="imgCover" alt="" v-if="imgCover" />
      <video-component
        class="embed-cover_video"
        :srcVideo="videoSrc"
        :srcWidth="videoCoverWidth"
        :srcHeight="videoCoverHeight"
        :maxWidth="1400"
        :maxHeight="600"
        :embedCover="coverSrc"
        type="telegram"
        v-if="videoCover"
      />
    </div>
  </div>
</template>

<script>
import DateTime from "./DateTime.vue";
import VideoComponent from "./VideoComponent.vue";
import TelegramLogo from "@/assets/logos/telegram_logo.svg?inline";

export default {
  components: { DateTime, VideoComponent, TelegramLogo },

  props: {
    authorAvatar: String,
    authorName: String,
    dateTime: [String, Number],
    text: String,
    imgCover: String,
    videoCover: Object,
  },

  computed: {
    videoSrc() {
      return this.videoCover.src;
    },

    videoCoverWidth() {
      return this.videoCover.width;
    },

    videoCoverHeight() {
      return this.videoCover.height;
    },

    coverSrc() {
      return this.videoCover.thumbnail_url;
    },
  },
};
</script>