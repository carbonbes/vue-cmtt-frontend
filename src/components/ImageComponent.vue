<template>
  <div class="img-wrapp" id="image-wrapp" :style="styleObject">
    <a
      :href="`https://leonardo.osnova.io/${image}/-/preview/1200/-/format/webp/`"
      :data-pswp-width="this.srcWidth"
      :data-pswp-height="this.srcHeight"
      target="_blank"
    >
      <img
        :src="`https://leonardo.osnova.io/${image}/-/preview/1200/-/format/webp/`"
      />
    </a>
  </div>
</template>

<script>
import { сalculateAspectRatio } from "@/utils/сalculateAspectRatio";
import PhotoSwipeLightbox from "photoswipe/dist/photoswipe-lightbox.esm.js";

export default {
  computed: {
    styleObject() {
      return {
        maxWidth:
          (this.srcWidth >= this.maxWidth &&
            (this.srcHeight > this.maxHeight ||
              this.srcHeight < this.maxHeight)) ||
          (this.srcWidth < this.maxWidth && this.srcHeight > this.maxHeight)
            ? this.calculatedWidth + "px"
            : this.srcWidth + "px",
        maxHeight:
          this.srcHeight < this.maxHeight
            ? this.srcHeight + "px"
            : this.calculatedHeight + "px",
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

    calculatedHeight() {
      const { height } = сalculateAspectRatio(
        this.srcWidth,
        this.srcHeight,
        this.maxWidth,
        this.maxHeight
      );

      return height;
    },
  },

  props: {
    image: String,
    type: [String, Number],
    srcWidth: Number,
    srcHeight: Number,
    maxWidth: [String, Number],
    maxHeight: [String, Number],
  },

  mounted() {
    if (!this.lightbox) {
      this.lightbox = new PhotoSwipeLightbox({
        gallery: "#image-wrapp",
        children: "a",
        pswpModule: () => import("photoswipe"),
        padding: { top: 20, bottom: 40, left: 100, right: 100 },
      });
      this.lightbox.init();
    }
  },

  unmounted() {
    if (this.lightbox) {
      this.lightbox.destroy();
      this.lightbox = null;
    }
  },
};
</script>