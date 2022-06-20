<template>
  <div class="entry-page__img-block">
    <div class="image" :class="classObject">
      <Image
        :imageSrc="this.item.data.items[0].image.data.uuid"
        type="2"
        :srcWidth="srcWidth"
        :srcHeight="srcHeight"
        maxWidth="1020"
        maxHeight="600"
      />
    </div>

    <div
      class="entry-page__img-block_description ep-island"
      v-text="description"
      v-if="description"
    ></div>
  </div>
</template>

<script>
import Image from "../ImageComponent.vue";
import сalculateSizes from "@/utils/сalculateSizes";

export default {
  props: {
    item: Object,
  },

  components: { Image },

  computed: {
    srcWidth() {
      return this.item.data.items[0].image.data.width;
    },

    srcHeight() {
      return this.item.data.items[0].image.data.height;
    },

    description() {
      return this.item.data.items[0].title;
    },

    classObject() {
      return {
        image_wide: this.srcWidth >= 1020 || this.srcWidth > this.srcHeight,
        image_thin: this.srcWidth < 1020 || this.srcWidth < this.srcHeight,
      };
    },

    calculatedWidth() {
      const { width } = сalculateSizes(
        this.srcWidth,
        this.srcHeight,
        1020,
        600
      );

      return width;
    },
  },
};
</script>

<style lang="scss">
.entry-page__img-block {
  margin: 24px auto;
  width: 640px;

  &:first-child {
    margin-top: 0;
  }

  .image {
    &_wide {
      width: 100%;
    }

    &_thin {
      padding: 8px 30px;
      max-width: 640px;
      background: var(--article-cover-bg);

      > div {
        margin: 0 auto;
        max-width: 55%;
      }
    }
  }

  &_description {
    margin-top: 10px;
    color: var(--grey-color);
    font-size: 15px;
    line-height: 22px;
  }
}

@media screen and (max-width: 768px) {
  .entry-page__img-block {
    width: unset;
  }
}
</style>