<template>
  <div class="embed">
    <div class="embed-header">
      <img class="embed-header__author-avatar" :src="authorAvatar" alt="" />
      <div class="embed-header__data">
        <div class="embed-header__author-wrap">
          <div class="embed-header__author-name">{{ authorName }}</div>
          <span class="embed-header__author-tag">@{{ authorTag }}</span>
        </div>
        <date-time
          :date="dateTime"
          :type="1"
          :title="new Date(dateTime).toLocaleString()"
        />
      </div>
      <div class="spacer" />
      <div class="embed-header__logo">
        <twitter-logo class="twitter-logo" />
      </div>
    </div>
    <div class="embed-text__wrap">
      <div class="embed-text" v-html="text" v-if="text"></div>
    </div>
    <div class="embed-cover" v-if="imgSrc || videoSrc">
      <img :src="imgSrc" alt="" v-if="imgSrc" />
      <video-component
        class="embed-cover_video"
        :srcVideo="videoSrc"
        :srcWidth="videoSrcWidth"
        :srcHeight="videoSrcHeight"
        :maxWidth="1400"
        :maxHeight="600"
        :embedCover="videoCover"
        type="embed"
        v-if="videoSrc"
      />
    </div>
  </div>
</template>

<script>
import DateTime from "./DateTime.vue";
import VideoComponent from "./VideoComponent.vue";
import TwitterLogo from "@/assets/logos/twitter_logo.svg?inline";

export default {
  props: {
    authorAvatar: String,
    authorName: String,
    authorTag: String,
    dateTime: [String, Number],
    text: String,
    media: Object,
  },

  components: {
    DateTime,
    VideoComponent,
    TwitterLogo,
  },

  computed: {
    dateTime() {
      return Date.parse(this.dateTime);
    },

    imgSrc() {
      if (this.media && this.media[0].type === "photo") {
        return this.media[0].media_url_https;
      }
    },

    videoSrc() {
      if (this.media && this.media[0].type === "video") {
        return this.media[0].video_info.variants[0].url;
      }
    },

    videoCover() {
      if (this.media && this.media[0].type === "video") {
        return this.media[0].media_url_https;
      }
    },

    videoSrcWidth() {
      if (this.media && this.media[0].type === "video") {
        return this.media[0].sizes.large.w;
      }
    },

    videoSrcHeight() {
      if (this.media && this.media[0].type === "video") {
        return this.media[0].sizes.large.h;
      }
    },
  },
};
</script>