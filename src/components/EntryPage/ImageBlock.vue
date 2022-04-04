<template>
  <div class="entry-page__img-block" :class="classObject">
    <Image
      :image="this.item.data.items[0].image.data.uuid"
      type="2"
      :srcWidth="this.item.data.items[0].image.data.width"
      :srcHeight="this.item.data.items[0].image.data.height"
      maxWidth="1020"
      maxHeight="1500"
    />
  </div>
</template>

<script>
import Image from "../ImageComponent.vue";
import { сalculateAspectRatio } from "@/utils/сalculateAspectRatio";

export default {
  props: {
    item: Object,
  },

  components: { Image },

  computed: {
    classObject() {
      return {
        "entry-page__img-block_wide":
          this.item.data.items[0].image.data.width > 1020,
        "entry-page__img-block_thin": this.calculatedWidth < 1020,
        "entry-page__img-block_vertical":
          this.item.data.items[0].image.data.width <
          this.item.data.items[0].image.data.height,
        "entry-page__img-block_highlighted": this.item.data.with_background,
        "entry-page__img-block_with-border": this.item.data.with_border,
      };
    },

    calculatedWidth() {
      const { width } = сalculateAspectRatio(
        this.item.data.items[0].image.data.width,
        this.item.data.items[0].image.data.height,
        1020,
        1500
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

  &_wide {
    width: 100%;
  }

  &_with-border {
    & > div {
      border: 1px solid var(--embed-border-color);
    }
  }

  &_vertical {
    &.entry-page__img-block_highlighted {
      & > div {
        max-width: 55% !important;
      }
    }
  }

  &_highlighted {
    margin-left: auto;
    margin-right: auto;
    padding: 30px;
    max-width: 640px;
    border-radius: 8px;
    background: var(--highlight-block-color);

    & > div {
      margin: 0 auto;
    }
  }
}

@media screen and (max-width: 768px) {
  .entry-page__img-block {
    width: unset;
  }
}
</style>