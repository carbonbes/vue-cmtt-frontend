<template>
  <div class="entry">
    <div class="entry-repost-data e-island" v-if="entry.repost">
      <div class="entry-repost__icon"><repost-icon class="icon" /></div>
      <span class="entry-repost__name"
        >{{ entry.repost.author.name }} сделал репост</span
      >
    </div>
    <entry-header
      class="e-island"
      :subsiteData="entry.subsite"
      :subsiteType="entry.subsite.type"
      :subsiteId="entry.subsite.id"
      :subsiteAvatar="entry.subsite.avatar.data.uuid"
      :subsiteName="entry.subsite.name"
      :authorType="entry.author.type"
      :authorId="entry.author.id"
      :authorName="entry.author.name"
      :date="entry.date"
    />
    <div class="entry-content">
      <div class="entry-content__title e-island" v-if="entry.title">
        <entry-title :title="entry.title" :isEditorial="entry.isEditorial" />
      </div>
      <div class="entry-content__subtitle e-island" v-if="subtitle.length > 0">
        {{ subtitle[0].data.text }}
      </div>
      <template
        v-for="telegramData in telegramCovers"
        :key="telegramData.data.telegram.data.tg_data.id"
        ><telegram-component
          :authorAvatar="
            telegramData.data.telegram.data.tg_data.author.avatar_url
          "
          :authorName="telegramData.data.telegram.data.tg_data.author.name"
          :dateTime="telegramData.data.telegram.data.tg_data.datetime"
          :text="telegramData.data.telegram.data.tg_data.text"
          :videoCover="telegramData.data.telegram.data.tg_data.videos[0]?.src"
          v-if="telegramCovers.length > 0"
      /></template>
      <template
        v-for="twitterData in twitterCovers"
        :key="twitterData.data.tweet.data.tweet_data.id"
        ><twitter-component :data="twitterData" v-if="twitterCovers.length > 0"
      /></template>
      <link-component :data="linkCovers" v-if="linkCovers.length > 0" />
      <div
        class="entry-content__cover"
        :class="imageClassObject"
        v-if="imageCovers.length > 0"
      >
        <image-component
          :image="imageCovers[0].data.items[0].image"
          :srcWidth="imageCovers[0].data.items[0].image.data.width"
          :srcHeight="imageCovers[0].data.items[0].image.data.height"
          :maxWidth="640"
          :maxHeight="600"
          :type="1"
        />
      </div>
      <div
        class="entry-content__cover"
        :class="videoClassObject"
        v-if="videoCovers.length > 0"
      >
        <video-component
          :video="videoCovers"
          :srcWidth="videoCovers[0].data.video.data.width"
          :srcHeight="videoCovers[0].data.video.data.height"
          :maxWidth="640"
          :maxHeight="600"
          :externalService="videoCovers[0].data.video.data.external_service"
        />
      </div>
      <div
        class="entry-content__cover"
        :class="gifClassObject"
        v-if="gifCovers.length > 0"
      >
        <video-component
          :video="gifCovers[0].data.items[0].image.data.uuid"
          :srcWidth="gifCovers[0].data.items[0].image.data.width"
          :srcHeight="gifCovers[0].data.items[0].image.data.height"
          :maxWidth="640"
          :maxHeight="600"
        />
      </div>
    </div>
    <entry-footer
      class="e-island"
      :commentsCount="entry.counters.comments"
      :repostsCount="entry.counters.reposts"
      :favoritesCount="entry.counters.favorites"
      :entryRating="entry.likes"
    />
    <router-link class="entry__link" :to="entry.id.toString()"></router-link>
  </div>
</template>

<script>
import EntryHeader from "@/components/Entry/EntryHeader.vue";
import EntryTitle from "@/components/Entry/EntryTitle.vue";
import EntryFooter from "@/components/Entry/EntryFooter.vue";
import ImageComponent from "@/components/ImageComponent.vue";
import VideoComponent from "@/components/VideoComponent.vue";
import TelegramComponent from "@/components/TelegramComponent.vue";
import TwitterComponent from "@/components/TwitterComponent.vue";
import RepostIcon from "@/assets/logos/repost_icon.svg?inline";
import LinkComponent from "@/components/LinkComponent.vue";

export default {
  components: {
    EntryHeader,
    EntryTitle,
    EntryFooter,
    ImageComponent,
    VideoComponent,
    LinkComponent,
    TwitterComponent,
    TelegramComponent,
    RepostIcon,
  },

  computed: {
    subtitle() {
      return this.entry.blocks.filter(
        (block) => block.type === "text" && block.cover === true
      );
    },

    imageCovers() {
      return this.entry.blocks.filter(
        (cover) =>
          cover.type === "media" &&
          cover.cover === true &&
          (cover.data.items[0].image.data.type === "jpg" ||
            cover.data.items[0].image.data.type === "png" ||
            cover.data.items[0].image.data.type === "webp")
      );
    },

    videoCovers() {
      return this.entry.blocks.filter(
        (cover) => cover.type === "video" && cover.cover === true
      );
    },

    gifCovers() {
      return this.entry.blocks.filter(
        (cover) =>
          cover.type === "media" &&
          cover.cover === true &&
          cover.data.items[0].image.data.type === "gif"
      );
    },

    moovieCovers() {
      return this.entry.blocks.filter(
        (cover) => cover.type === "moovie" && cover.cover === true
      );
    },

    telegramCovers() {
      return this.entry.blocks.filter(
        (cover) => cover.type === "telegram" && cover.cover === true
      );
    },

    twitterCovers() {
      return this.entry.blocks.filter(
        (cover) => cover.type === "tweet" && cover.cover === true
      );
    },

    linkCovers() {
      return this.entry.blocks.filter(
        (cover) => cover.type === "link" && cover.cover === true
      );
    },

    imageClassObject() {
      if (this.imageCovers.length > 0) {
        return {
          "entry-content__cover_vertical":
            this.imageCovers[0].data.items[0].image.data.height >
            this.imageCovers[0].data.items[0].image.data.width,
          "entry-content__cover_wide":
            this.imageCovers[0].data.items[0].image.data.width >= 640 &&
            !this.imageCovers[0].data.with_background,
          "entry-content__cover_thin":
            this.imageCovers[0].data.items[0].image.data.width <= 640 &&
            !this.imageCovers[0].data.with_background,
          "entry-content__cover_highlighted":
            this.imageCovers[0].data.with_background,
        };
      }
    },

    videoClassObject() {
      if (this.videoCovers.length > 0) {
        return {
          "entry-content__cover_vertical":
            this.videoCovers[0].data.video.data.height >
            this.videoCovers[0].data.video.data.width,
          "entry-content__cover_wide":
            this.videoCovers[0].data.video.data.width >= 640 &&
            !this.videoCovers[0].data.with_background,
          "entry-content__cover_thin":
            this.videoCovers[0].data.video.data.width <= 640 &&
            !this.videoCovers[0].data.with_background &&
            !Object.keys(this.videoCovers[0].data.video.data.external_service)
              .length,
          "entry-content__cover_highlighted":
            this.videoCovers[0].data.with_background,
        };
      }
    },

    gifClassObject() {
      if (this.gifCovers.length > 0) {
        return {
          "entry-content__cover_vertical":
            this.gifCovers[0].data.items[0].image.data.height >
            this.gifCovers[0].data.items[0].image.data.width,
          "entry-content__cover_wide":
            this.gifCovers[0].data.items[0].image.data.width >= 640 &&
            !this.gifCovers[0].data.items[0].image.data.width,
          "entry-content__cover_thin":
            this.gifCovers[0].data.items[0].image.data.width <= 640 &&
            !this.gifCovers[0].data.with_background,
          "entry-content__cover_highlighted":
            this.gifCovers[0].data.with_background,
        };
      }
    },
  },

  props: {
    entry: Object,
  },
};
</script>

<style lang="scss">
.entry {
  position: relative;
  max-width: 640px;
  display: flex;
  flex-flow: column;
  color: var(--black-color);
  background: var(--entry-bg-color);
  border-radius: 8px;

  & .entry-header {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  & .entry-title {
    font-size: 22px;
    font-weight: 500;
    line-height: 1.3em;
  }

  & .entry-footer {
    padding-top: 15px;
    padding-bottom: 15px;
    z-index: 1;
  }
}

.entry-repost-data {
  margin-top: 16px;
  display: flex;
  align-items: center;
  font-size: 15px;
}

.entry-repost__icon {
  margin-right: 9px;
  display: flex;

  & .icon {
    width: 20px;
    height: 20px;
    color: var(--grey-color);
  }
}

.entry-repost__name {
  color: var(--grey-color);
}

.entry-content {
  word-break: break-word;
  line-height: 1.5em;

  & .embed,
  .link-block {
    margin-left: 20px;
    margin-right: 20px;
  }
}

.entry-content__title {
  & + .entry-content__subtitle {
    margin-top: 7px;
  }
}

.entry-content__title,
.entry-content__subtitle {
  & + .entry-content__cover {
    margin-top: 12px;
  }

  & + .embed {
    margin-top: 12px;
  }

  & + .link-block {
    margin-top: 12px;
  }
}

.entry-content__cover {
  &:not(:first-child) {
    margin-top: 12px;
  }

  &_thin {
    padding: 0 20px;
  }

  &_wide {
    width: 100%;
  }

  &_vertical {
    padding: 0 20px;

    &.entry-content__cover_highlighted {
      & > div {
        max-width: 55% !important;
      }
    }
  }

  &_highlighted {
    padding: 30px;
    background: var(--highlight-block-color);

    & > div {
      margin: 0 auto;
    }
  }
}

.entry__link {
  position: absolute;
  width: 100%;
  height: 100%;
}

.e-island {
  padding-left: 20px;
  padding-right: 20px;
}

@media (hover: hover) {
  .entry {
    &:hover {
      & .entry-header__subsite-data {
        z-index: 2;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .e-island {
    padding-left: 15px;
    padding-right: 15px;
  }

  .entry {
    border-radius: 0;
  }

  .entry-content {
    .embed,
    .link-block {
      margin-left: 15px;
      margin-right: 15px;
    }
  }
}
</style>