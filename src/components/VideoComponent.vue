<template>
  <div :style="styleObject">
    <div class="video-wrapp" :style="wrappStyleObject">
      <div
        class="video__pseudo-player"
        v-if="!this.isPlaying"
        :style="pseudoPlayerStyleObject"
        @click="togglePlaying"
      >
        <play-icon class="default-icon icon" v-if="isDefaultVideo" />
        <youtube-icon class="youtube-icon icon" v-if="isYoutube" />
        <coub-icon class="coub-icon icon" v-if="isCoub" />
      </div>

      <video
        class="video"
        autoplay
        playsInline
        controls
        v-if="isDefaultVideo && this.isPlaying"
      >
        <source :src="`https://leonardo.osnova.io/${srcVideo}/-/format/mp4/`" />
      </video>

      <iframe
        class="video"
        :src="`https://www.youtube.com/embed/${externalService.id}?controls=2&autoplay=1`"
        frameBorder="0"
        allowFullScreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        v-if="isYoutube && this.isPlaying"
      />

      <iframe
        class="video"
        :src="`https://player.vimeo.com/video/${externalService.id}?autoplay=1`"
        frameBorder="0"
        allowFullScreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        v-if="isVimeo && this.isPlaying"
      />

      <video
        class="video"
        autoplay
        playsInline
        controls
        v-if="isGfycat && this.isPlaying"
      >
        <source :src="`${externalService.mp4_url}`" />
      </video>

      <video
        class="video"
        autoplay
        playsInline
        controls
        v-if="isGiphy && this.isPlaying"
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
      />
    </div>
  </div>
</template>

<script>
import PlayIcon from "@/assets/logos/play_icon.svg?inline";
import YoutubeIcon from "@/assets/logos/youtube_icon.svg?inline";
import CoubIcon from "@/assets/logos/coub_icon.svg?inline";
import { сalculateAspectRatio } from "@/utils/сalculateAspectRatio";

export default {
  components: {
    PlayIcon,
    YoutubeIcon,
    CoubIcon,
  },

  props: {
    srcVideo: String,
    srcWidth: Number,
    srcHeight: Number,
    maxWidth: Number,
    maxHeight: Number,
    externalService: Object,
  },

  data() {
    return { isPlaying: false };
  },

  methods: {
    togglePlaying() {
      this.isPlaying = !this.isPlaying;
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgb(70, 19, 58)",
        backgroundImage: this.coverPseudoPlayer,
        backgroundSize: "cover",
        backgroundPosition: "center center",
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

    coverPseudoPlayer() {
      return `url(https://leonardo.osnova.io/${this.srcVideo}/-/format/webp/-/preview/700/)`;
    },
  },
};
</script>