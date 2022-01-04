<template>
  <div class="img-wrapp" :style="styleObject">
    <img
      :src="`https://leonardo.osnova.io/${uuid}/-/preview/1200/-/format/webp/`"
      alt=""
    />
  </div>
</template>

<script>
import { сalculateAspectRatio } from "@/utils/сalculateAspectRatio";

export default {
  computed: {
    styleObject: function () {
      return {
        margin:
          this.calculatedWidth < this.maxWidth && this.type === 1
            ? "0 auto"
            : null,
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

    calculatedWidth: function () {
      const { width } = сalculateAspectRatio(
        this.srcWidth,
        this.srcHeight,
        this.maxWidth,
        this.maxHeight
      );

      return width;
    },

    uuid: function () {
      return this.image[0].data.items[0].image.data.uuid;
    },

    srcWidth: function () {
      return this.image[0].data.items[0].image.data.width;
    },

    srcHeight: function () {
      return this.image[0].data.items[0].image.data.height;
    },
  },

  props: {
    image: Object,
    type: Number,
    maxWidth: Number,
    maxHeight: Number,
  },
};
</script>