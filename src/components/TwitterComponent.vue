<template>
  <div class="embed">
    <div class="embed-header">
      <img class="embed-header__author-avatar" :src="authorAvatar" alt="" />
      <div class="embed-header__data">
        <div class="embed-header__author-wrap">
          <div class="embed-header__author-name">{{ authorName }}</div>
          <span class="embed-header__author-tag">@{{ authorTag }}</span>
        </div>
        <DateTime
          :date="dateTimeFormatted"
          type="1"
          :title="new Date(dateTimeFormatted).toLocaleString()"
        />
      </div>
      <div class="spacer" />
      <div class="embed-header__logo">
        <TwitterLogo class="twitter-logo" />
      </div>
    </div>
    <div class="embed-text__wrap" v-if="text">
      <div class="embed-text" v-html="text"></div>
    </div>
    <div class="embed-cover" v-if="imgSrc || videoSrc">
      <div class="embed-cover__img" v-if="imgSrc && this.media.length === 1">
        <ImageComponent
          :image-src="imgSrc"
          :src-width="imageSrcWidth"
          :src-height="imageSrcHeight"
          max-width="400"
          max-height="460"
          type="embed"
        />
      </div>

      <div class="embed-cover__gallery" v-if="imagesGallery">
        <GalleryComponent :src-images="imagesGallery" type="twitter_embed" />
      </div>

      <div class="embed-cover__video" v-if="videoSrc">
        <VideoComponent
          :src-video="videoSrc"
          :src-width="videoSrcWidth"
          :src-height="videoSrcHeight"
          max-width="400"
          max-height="460"
          :embed-cover="videoCover"
          type="embed"
          :content-type="videoContentType"
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
import TwitterLogo from "@/assets/logos/twitter_logo.svg?inline";

export default {
  props: [
    "authorAvatar",
    "authorName",
    "authorTag",
    "dateTime",
    "text",
    "media",
  ],

  components: {
    DateTime,
    VideoComponent,
    ImageComponent,
    GalleryComponent,
    TwitterLogo,
  },

  computed: {
    dateTimeFormatted() {
      return Date.parse(this.dateTime);
    },

    imgSrc() {
      if (this.media && this.media[0].type === "photo") {
        return this.media[0].media_url_https;
      }
    },

    imageSrcWidth() {
      if (this.media && this.media[0].type === "photo") {
        return this.media[0].sizes.large.w;
      }
    },

    imageSrcHeight() {
      if (this.media && this.media[0].type === "photo") {
        return this.media[0].sizes.large.h;
      }
    },

    imagesGallery() {
      if (
        this.media &&
        this.media.length > 1 &&
        this.media[0].type === "photo"
      ) {
        return this.media;
      }
    },

    videoSrc() {
      if (
        (this.media && this.media[0].type === "video") ||
        (this.media && this.media[0].type === "animated_gif")
      ) {
        return this.media[0].video_info.variants[0].url;
      }
    },

    videoCover() {
      if (
        (this.media && this.media[0].type === "video") ||
        (this.media && this.media[0].type === "animated_gif")
      ) {
        return this.media[0].media_url_https;
      }
    },

    videoSrcWidth() {
      if (
        (this.media && this.media[0].type === "video") ||
        (this.media && this.media[0].type === "animated_gif")
      ) {
        return this.media[0].sizes.large.w;
      }
    },

    videoSrcHeight() {
      if (
        (this.media && this.media[0].type === "video") ||
        (this.media && this.media[0].type === "animated_gif")
      ) {
        return this.media[0].sizes.large.h;
      }
    },

    videoContentType() {
      if (this.media && this.media[0].type === "video") {
        return this.media[0].video_info.variants[0].content_type;
      }
    },
  },
};
</script>