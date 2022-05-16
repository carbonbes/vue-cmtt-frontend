<template>
  <div class="entry-page__video-block" :class="classObject">
    <video-component
      :srcVideo="item.data.items[0].image.data.uuid"
      :srcWidth="item.data.items[0].image.data.width"
      :srcHeight="item.data.items[0].image.data.height"
      :maxWidth="maxWidth"
      :maxHeight="maxHeight"
      :externalService="item.data.items[0].image.data.external_service"
      v-if="type === 'default'"
    />

    <video-component
      :srcVideo="item.data.video.data.thumbnail.data.uuid"
      :srcWidth="item.data.video.data.width"
      :srcHeight="item.data.video.data.height"
      :maxWidth="maxWidth"
      :maxHeight="maxHeight"
      :externalService="item.data.video.data.external_service"
      v-if="type === 'video'"
    />
  </div>
</template>

<script>
import VideoComponent from "@/components/VideoComponent.vue";

export default {
  props: {
    item: Object,
    type: String,
  },

  components: {
    VideoComponent,
  },

  computed: {
    classObject() {
      if (this.type === "default") {
        return {
          "entry-page__video-block_wide":
            this.item.data.items[0].image.data.width > this.maxWidth,
          "entry-page__video-block_thin":
            this.item.data.items[0].image.data.width < this.maxWidth,
          "entry-page__video-block_vertical":
            this.item.data.items[0].image.data.width <
            this.item.data.items[0].image.data.height,
        };
      } else if (this.type === "video") {
        return {
          "entry-page__video-block_wide":
            this.item.data.video.data.width > this.maxWidth ||
            this.item.data.video.data.external_service,
          "entry-page__video-block_vertical":
            this.item.data.video.data.width < this.item.data.video.data.height,
        };
      }
    },

    maxWidth() {
      return 640;
    },

    maxHeight() {
      return 700;
    },
  },
};
</script>

<style lang="scss">
.entry-page__video-block {
  margin-left: auto;
  margin-right: auto;
  width: 640px;

  &:last-child {
    margin-bottom: 15px;
  }

  &_wide {
    width: 100%;

    & > div {
      margin-left: auto;
      margin-right: auto;
    }
  }

  &_vertical,
  &_thin {
    margin-left: auto;
    margin-right: auto;
    padding: 15px 30px;
    max-width: 640px;
    background: var(--entry-block-highlight);

    & > div {
      margin: 0 auto;
      max-width: var(--vertical-max-width);
    }
  }

  & + .entry-page__video-block {
    margin-top: 7px;
  }
}

@media (max-width: 640px) {
  .entry-page__video-block {
    &_thin,
    &_vertical {
      padding: 0;
    }
  }
}

@media (max-width: 768px) {
  .entry-page__video-block {
    width: 100%;
  }
}
</style>