<template>
  <div class="entry-page__video-block" :class="classObject">
    <video-component
      :srcVideo="item.data.items[0].image.data.uuid"
      :srcWidth="item.data.items[0].image.data.width"
      :srcHeight="item.data.items[0].image.data.height"
      :maxWidth="1020"
      :maxHeight="1500"
      :externalService="item.data.items[0].image.data.external_service"
      v-if="type === 'default'"
    />

    <video-component
      :srcVideo="item.data.video.data.thumbnail.data.uuid"
      :srcWidth="item.data.video.data.width"
      :srcHeight="item.data.video.data.height"
      :maxWidth="1020"
      :maxHeight="1500"
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
            this.item.data.items[0].image.data.width > 1020,
          "entry-page__video-block_vertical":
            this.item.data.items[0].image.data.width <
            this.item.data.items[0].image.data.height,
          "entry-page__video-block_highlighted": this.item.data.with_background,
        };
      } else if (this.type === "video") {
        return {
          "entry-page__video-block_wide":
            this.item.data.video.data.width > 1020 || this.item.data.video.data.external_service,
          "entry-page__video-block_vertical":
            this.item.data.video.data.width <
            this.item.data.video.data.height,
          "entry-page__video-block_highlighted": this.item.data.video.with_background,
        };
      }
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
  }

  &_with-border {
    & > div {
      border: 1px solid var(--embed-border-color);
    }
  }

  &_vertical {
    &.entry-page__video-block_highlighted {
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
    background: var(--highlight-block-color);

    & > div {
      margin: 0 auto;
    }
  }
}

@media screen and (max-width: 768px) {
  .entry-page__video-block {
    width: 100%;
  }
}
</style>