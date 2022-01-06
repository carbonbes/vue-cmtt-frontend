<template>
  <div :style="styleObject">
    <div class="video-wrapp" :style="wrappStyleObject">
      <video class="video" playsInline controls v-if="isDefaultVideo">
        <source :src="`https://leonardo.osnova.io/${video}/-/format/mp4/`" />
      </video>

      <iframe
        class="video"
        :src="`https://www.youtube.com/embed/${externalService.id}?controls=2&showinfo=0`"
        frameBorder="0"
        allowFullScreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        v-if="isYoutube"
      />

      <iframe
        class="video"
        :src="`https://player.vimeo.com/video/${externalService.id}`"
        frameBorder="0"
        allowFullScreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        v-if="isVimeo"
      />

      <video class="video" playsInline controls v-if="isGfycat">
        <source :src="`${externalService.mp4_url}`" />
      </video>

      <video class="video" playsInline controls v-if="isGiphy">
        <source :src="`${externalService.mp4_url}`" />
      </video>

      <iframe
        class="video"
        :src="`https://coub.com/embed/${externalService.id}`"
        frameBorder="0"
        allowFullScreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        v-if="isCoub"
      />
    </div>
  </div>
</template>

<script>
import { сalculateAspectRatio } from "@/utils/сalculateAspectRatio";

export default {
  computed: {
    styleObject() {
      return {
        margin:
          this.calculatedWidth < this.maxWidth && this.type === 1
            ? "0 auto"
            : null,
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

      return Math.round(width);
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
  },

  props: {
    video: String,
    type: String,
    srcWidth: Number,
    srcHeight: Number,
    maxWidth: Number,
    maxHeight: Number,
    externalService: Object,
  },
};
</script>

<style>
</style>