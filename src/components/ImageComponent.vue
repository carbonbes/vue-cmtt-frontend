<template>
  <div class="img-wrapp" id="image-wrapp" :style="styleObject">
    <a
      :href="image"
      :data-pswp-width="this.srcWidth"
      :data-pswp-height="this.srcHeight"
      target="_blank"
    >
      <img :src="image" />
    </a>
  </div>
</template>

<script>
import { сalculateAspectRatio } from "@/utils/сalculateAspectRatio";
import PhotoSwipeLightbox from "photoswipe/dist/photoswipe-lightbox.esm.min.js";

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
          this.srcHeight >= this.maxHeight
            ? this.calculatedHeight + "px"
            : this.srcHeight + "px",
      };
    },

    image() {
      if (this.type === "embed") {
        return this.imageSrc;
      } else
        return `https://leonardo.osnova.io/${this.imageSrc}/-/preview/1200/-/format/webp/`;
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
    imageSrc: String,
    srcWidth: [String, Number],
    srcHeight: [String, Number],
    maxWidth: [String, Number],
    maxHeight: [String, Number],
    type: String,
  },

  data() {
    return {
      lightbox: null,
    };
  },

  mounted() {
    if (!this.lightbox) {
      this.lightbox = new PhotoSwipeLightbox({
        gallery: "#image-wrapp",
        children: "a",
        pswpModule: () => import("photoswipe/dist/photoswipe.esm.min.js"),
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