<template>
  <div class="entry-page__video-block" :class="classObject">
    <VideoComponent
      :src-video="item.data.items[0].image.data.uuid"
      :src-width="item.data.items[0].image.data.width"
      :src-height="item.data.items[0].image.data.height"
      max-width="640"
      max-height="460"
      :external-service="item.data.items[0].image.data.external_service"
      v-if="type === 'default'"
    />

    <VideoComponent
      :src-video="item.data.video.data.thumbnail.data.uuid"
      :src-width="item.data.video.data.width"
      :src-height="item.data.video.data.height"
      max-width="640"
      max-height="460"
      :external-service="item.data.video.data.external_service"
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
            this.item.data.items[0].image.data.width > 640,
          "entry-page__video-block_thin":
            this.item.data.items[0].image.data.width < 640 ||
            this.item.data.items[0].image.data.width <
              this.item.data.items[0].image.data.height,
        };
      } else if (this.type === "video") {
        return {
          "entry-page__video-block_wide":
            this.item.data.video.data.width > 640 ||
            this.item.data.video.data.external_service,
          "entry-page__video-block_thin":
            this.item.data.video.data.width < this.item.data.video.data.height,
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

    > div {
      margin-left: auto;
      margin-right: auto;
    }
  }

  &_thin {
    margin-left: auto;
    margin-right: auto;
    padding: 8px 0;
    max-width: 640px;
    background: var(--article-cover-bg);

    > div {
      margin: 0 auto;
      max-width: 55%;
    }
  }

  + .entry-page__video-block {
    margin-top: 7px;
  }
}

@media (max-width: 640px) {
  .entry-page__video-block {
    &_thin {
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