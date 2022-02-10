<template>
  <div class="img-wrapp" :style="styleObject">
    <img
      :src="`https://leonardo.osnova.io/${this.image.data.uuid}/-/preview/1200/-/format/webp/`"
      alt=""
    />
  </div>
</template>

<script>
import { сalculateAspectRatio } from "@/utils/сalculateAspectRatio";

export default {
  computed: {
    styleObject() {
      return {
        /* padding: this.calculatedWidth <= this.maxWidth ? "var(--entry-cover-gap)" : null, */
        maxWidth:
          (this.srcWidth >= this.maxWidth &&
            (this.srcHeight > this.maxHeight ||
              this.srcHeight < this.maxHeight)) ||
          (this.srcWidth < this.maxWidth && this.srcHeight > this.maxHeight)
            ? this.calculatedWidth + "px"
            : this.srcWidth + "px",
        maxHeight: this.maxHeight + "px",
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
  },

  props: {
    image: Object,
    type: Number,
    srcWidth: Number,
    srcHeight: Number,
    maxWidth: Number,
    maxHeight: Number,
  },
};
</script>