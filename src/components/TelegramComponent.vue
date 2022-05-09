<template>
  <div class="embed">
    <div class="embed-header">
      <div class="embed-header__author-avatar" :style="authorAvatar" />
      <div class="embed-header__data">
        <div class="embed-header__author-name">{{ authorName }}</div>
        <date-time
          :date="dateTime * 1000"
          type="1"
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
    <div class="embed-cover" v-if="imageSrc || videoSrc || imagesGallery">
      <div class="embed-cover__img" v-if="imageSrc">
        <ImageComponent
          :imageSrc="imageSrc"
          :srcWidth="imageSrcWidth"
          :srcHeight="imageSrcHeight"
          :maxWidth="1400"
          :maxHeight="600"
          type="embed"
        />
      </div>

      <div class="embed-cover__gallery" v-if="imagesGallery">
        <gallery-component :srcImages="imagesGallery" type="telegram_embed" />
      </div>

      <div class="embed-cover__video" v-if="videoCover">
        <video-component
          :srcVideo="videoSrc"
          :srcWidth="videoSrcWidth"
          :srcHeight="videoSrcHeight"
          :maxWidth="1400"
          :maxHeight="600"
          :embedCover="coverSrc"
          type="embed"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DateTime from "./DateTime.vue";
import ImageComponent from "./ImageComponent.vue";
import VideoComponent from "./VideoComponent.vue";
import GalleryComponent from "./Gallery/GalleryComponent.vue";
import TelegramLogo from "@/assets/logos/telegram_logo.svg?inline";

export default {
  components: {
    DateTime,
    ImageComponent,
    VideoComponent,
    GalleryComponent,
    TelegramLogo,
  },

  props: {
    authorAvatarSrc: String,
    authorName: String,
    dateTime: [String, Number],
    text: String,
    imgCover: Object,
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

    imageSrc() {
      if (this.imgCover.length === 1) return this.imgCover[0].leonardo_url;
    },

    imageSrcWidth() {
      if (this.imgCover.length === 1) return this.imgCover[0].width;
    },

    imageSrcHeight() {
      if (this.imgCover.length === 1) return this.imgCover[0].height;
    },

    imagesGallery() {
      if (this.imgCover.length > 1) return this.imgCover;
    },

    videoSrc() {
      if (this.videoCover) return this.videoCover.src;
    },

    videoSrcWidth() {
      if (this.videoCover) return this.videoCover.width;
    },

    videoSrcHeight() {
      if (this.videoCover) return this.videoCover.height;
    },

    coverSrc() {
      if (this.videoCover) return this.videoCover.thumbnail_url;
    },
  },

  methods: {
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },
  },

  mounted() {
    if (this.text && this.text.length > 300) {
      this.collapsed = true;
      this.collapsedText = this.text.slice(0, 300) + "...";
    }
  },
};
</script>