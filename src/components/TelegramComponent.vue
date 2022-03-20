<template>
  <div class="embed">
    <div class="embed-header">
      <div class="embed-header__author-avatar" :style="authorAvatar" />
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
    <div class="embed-text__wrap" v-if="text">
      <span class="embed-text" v-html="collapsed ? collapsedText : text"></span>
      <span
        class="embed-text__collapsed-btn"
        @click="this.toggleCollapse"
        v-if="collapsed"
        >Раскрыть</span
      >
    </div>
    <div class="embed-cover" v-if="imgCover || videoCover">
      <img :src="imgCover" alt="" v-if="imgCover" />
      <video-component
        class="embed-cover_video"
        :srcVideo="videoSrc"
        :srcWidth="videoSrcWidth"
        :srcHeight="videoSrcHeight"
        :maxWidth="1400"
        :maxHeight="600"
        :embedCover="coverSrc"
        type="embed"
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
    authorAvatarSrc: String,
    authorName: String,
    dateTime: [String, Number],
    text: String,
    imgCover: String,
    videoCover: Object,
  },

  data() {
    return {
      collapsed: null,
      collapsedText: null,
    };
  },

  computed: {
    authorAvatar() {
      return {
        backgroundImage: `url(${this.authorAvatarSrc})`,
      };
    },

    videoSrc() {
      return this.videoCover.src;
    },

    videoSrcWidth() {
      return this.videoCover.width;
    },

    videoSrcHeight() {
      return this.videoCover.height;
    },

    coverSrc() {
      return this.videoCover.thumbnail_url;
    },
  },

  methods: {
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },
  },

  mounted() {
    if (this.text && this.text.length > 325) {
      this.collapsedText = this.text.slice(0, 325) + "...";
      this.collapsed = true;
    }
  },
};
</script>