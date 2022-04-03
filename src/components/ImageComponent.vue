<template>
  <div class="img-wrapp" :style="styleObject">
    <img
      :src="`https://leonardo.osnova.io/${image}/-/preview/1200/-/format/webp/`"
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
    image: String,
    type: [String, Number],
    srcWidth: Number,
    srcHeight: Number,
    maxWidth: String,
    maxHeight: String,
  },
};
</script>