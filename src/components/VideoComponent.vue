<template>
  <div :style="styleObject">
    <div class="video-wrapp" :style="wrappStyleObject">
      <div
        class="video__pseudo-player"
        :class="typePlayer"
        v-if="!this.isPlaying"
        :style="pseudoPlayerStyleObject"
        @click="togglePlaying"
      >
        <play-icon class="default-icon icon" v-if="isDefaultVideo" />
        <youtube-icon class="youtube-icon icon" v-if="isYoutube" />
        <coub-icon class="coub-icon icon" v-if="isCoub" />
        <vimeo-icon class="vimeo-icon icon" v-if="isVimeo" />
      </div>

      <video
        class="video"
        autoplay
        playsInline
        controls
        loop
        v-if="isDefaultVideo && this.isPlaying"
        v-intersect="{
          type: 'when-hide',
          threshold: 1,
          callback: this.pausePlaying,
        }"
      >
        <source
          :src="
            this.type === 'embed'
              ? srcVideo
              : `https://leonardo.osnova.io/${srcVideo}/-/format/mp4/`
          "
        />
      </video>

      <iframe
        class="video"
        :src="`https://www.youtube.com/embed/${externalService.id}?controls=2&autoplay=1`"
        frameBorder="0"
        allowFullScreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        v-if="isYoutube && this.isPlaying"
        v-intersect="{
          type: 'when-hide',
          threshold: 1,
          callback: this.pausePlaying,
        }"
      />

      <iframe
        class="video"
        :src="`https://player.vimeo.com/video/${externalService.id}?autoplay=1`"
        frameBorder="0"
        allowFullScreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        v-if="isVimeo && this.isPlaying"
        v-intersect="{
          type: 'when-hide',
          threshold: 1,
          callback: this.pausePlaying,
        }"
      />

      <video
        class="video"
        autoplay
        playsInline
        controls
        v-if="isGfycat && this.isPlaying"
        v-intersect="{
          type: 'when-hide',
          threshold: 1,
          callback: this.pausePlaying,
        }"
      >
        <source :src="`${externalService.mp4_url}`" />
      </video>

      <video
        class="video"
        autoplay
        playsInline
        controls
        v-if="isGiphy && this.isPlaying"
        v-intersect="{
          type: 'when-hide',
          threshold: 1,
          callback: this.pausePlaying,
        }"
      >
        <source :src="`${externalService.mp4_url}`" />
      </video>

      <iframe
        class="video"
        :src="`https://coub.com/embed/${externalService.id}?autoplay=1`"
        frameBorder="0"
        allowFullScreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        v-if="isCoub && this.isPlaying"
        v-intersect="{
          type: 'when-hide',
          threshold: 1,
          callback: this.pausePlaying,
        }"
      />
    </div>
  </div>
</template>

<script>
import PlayIcon from "@/assets/logos/play_icon.svg?inline";
import YoutubeIcon from "@/assets/logos/youtube_icon.svg?inline";
import CoubIcon from "@/assets/logos/coub_icon.svg?inline";
import VimeoIcon from "@/assets/logos/vimeo_icon.svg?inline";
import { сalculateAspectRatio } from "@/utils/сalculateAspectRatio";

export default {
  components: {
    PlayIcon,
    YoutubeIcon,
    CoubIcon,
    VimeoIcon,
  },

  props: {
    srcVideo: String,
    srcWidth: [Number, String],
    srcHeight: [Number, String],
    maxWidth: [Number, String],
    maxHeight: [Number, String],
    externalService: Object,
    embedCover: String,
    type: String,
  },

  data() {
    return { isPlaying: false };
  },

  methods: {
    togglePlaying() {
      this.isPlaying = !this.isPlaying;
    },

    pausePlaying() {
      this.isPlaying = false;
    },
  },

  computed: {
    styleObject() {
      return {
        maxWidth:
          this.externalService && Object.keys(this.externalService).length !== 0
            ? this.maxWidth + "px"
            : (this.srcWidth >= this.maxWidth &&
                (this.srcHeight > this.maxHeight ||
                  this.srcHeight < this.maxHeight)) ||
              (this.srcWidth < this.maxWidth && this.srcHeight > this.maxHeight)
            ? this.calculatedWidth + "px"
            : this.srcWidth + "px",
      };
    },

    wrappStyleObject() {
      return {
        paddingTop: (this.srcHeight / this.srcWidth) * 100 + "%",
      };
    },

    calculatedWidth() {
      const { width } = сalculateAspectRatio(
        this.srcWidth,
        this.srcHeight,
        this.maxWidth,
        this.maxHeight
      );

      return width;
    },

    pseudoPlayerStyleObject() {
      return {
        backgroundImage: this.coverPseudoPlayer,
      };
    },

    isDefaultVideo() {
      return (
        !this.externalService || Object.keys(this.externalService).length === 0
      );
    },

    isYoutube() {
      return this.externalService?.name === "youtube";
    },

    isVimeo() {
      return this.externalService?.name === "vimeo";
    },

    isGfycat() {
      return this.externalService?.name === "gfycat";
    },

    isGiphy() {
      return this.externalService?.name === "giphy";
    },

    isCoub() {
      return this.externalService?.name === "coub";
    },

    typePlayer() {
      return {
        "default-player":
          !this.externalService ||
          Object.keys(this.externalService).length === 0,

        "embed-player":
          this.externalService?.name ===
          ("youtube" || "vimeo" || "gfycat" || "giphy" || "coub"),
      };
    },

    coverPseudoPlayer() {
      if (this.type === "embed") {
        return `url(${this.embedCover})`;
      } else {
        return `url(https://leonardo.osnova.io/${
          this.srcVideo || this.embedCover
        }/-/format/webp/-/preview/1200/)`;
      }
    },
  },
};
</script>