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
      :authorData="entry.author"
      :authorType="entry.author.type"
      :authorId="entry.author.id"
      :authorName="entry.author.name"
      :date="entry.date"
      dateType="0"
    />
    <div class="entry-content">
      <div class="entry-content__title e-island" v-if="entry.title">
        <entry-title :title="entry.title" :isEditorial="entry.isEditorial" />
      </div>

      <div
        class="entry-content__subtitle e-island"
        v-if="subtitleArr.length > 0"
      >
        <template v-for="(subtitle, i) in subtitleArr" :key="i">
          <entry-subtitle :string="subtitle.data.text" />
        </template>
      </div>

      <template
        v-for="telegramData in telegramCovers"
        :key="telegramData.data.telegram.data.tg_data.id"
        ><telegram-component
          :authorAvatarSrc="
            telegramData.data.telegram.data.tg_data.author.avatar_url
          "
          :authorName="telegramData.data.telegram.data.tg_data.author.name"
          :dateTime="telegramData.data.telegram.data.tg_data.datetime"
          :text="telegramData.data.telegram.data.tg_data.text"
          :imgCover="
            telegramData.data.telegram.data.tg_data.photos[0]?.leonardo_url
          "
          :videoCover="telegramData.data.telegram.data.tg_data.videos[0]"
          v-if="telegramCovers.length > 0"
      /></template>

      <template
        v-for="twitterData in twitterCovers"
        :key="twitterData.data.tweet.data.tweet_data.id"
        ><twitter-component
          :authorAvatar="
            twitterData.data.tweet.data.tweet_data.user.profile_image_url_https
          "
          :authorName="twitterData.data.tweet.data.tweet_data.user.name"
          :authorTag="twitterData.data.tweet.data.tweet_data.user.screen_name"
          :dateTime="twitterData.data.tweet.data.tweet_data.created_at"
          :text="twitterData.data.tweet.data.tweet_data.processed_text"
          :media="
            twitterData.data.tweet.data.tweet_data.extended_entities.media
          "
          v-if="twitterCovers.length > 0"
      /></template>

      <template v-for="(instagramData, index) in instagramCovers" :key="index">
        <instagram-embed
          :url="instagramData.data.instagram.data.box_data.url"
          v-if="instagramCovers.length > 0"
        />
      </template>

      <template v-for="(linkData, index) in linkCovers" :key="index">
        <link-component
          :title="linkData.data.link.data.title"
          :description="linkData.data.link.data.description"
          :urlSrc="linkData.data.link.data.url"
          :sourceIcon="linkData.data.link.data.image.data.uuid"
          v-if="linkCovers.length > 0"
        />
      </template>

      <template v-for="(quoteData, index) in quoteCovers" :key="index">
        <quote-component
          :avatarSrc="quoteData.data.image?.data.uuid"
          :authorSrc="quoteData.data.subline1"
          :bio="quoteData.data.subline2"
          :text="quoteData.data.text"
          :textSize="quoteData.data.text_size"
          v-if="quoteCovers.length > 0"
        />
      </template>

      <div
        class="entry-content__cover"
        :class="imageClassObject"
        v-if="imageCovers.length > 0"
      >
        <image-component
          :image="imageCovers[0].data.items[0].image.data.uuid"
          :srcWidth="imageCovers[0].data.items[0].image.data.width"
          :srcHeight="imageCovers[0].data.items[0].image.data.height"
          :maxWidth="640"
          :maxHeight="600"
          type="1"
        />
      </div>
      <div
        class="entry-content__cover"
        :class="videoClassObject"
        v-if="videoCovers.length > 0"
      >
        <video-component
          :srcVideo="videoCovers[0].data.video.data.thumbnail.data.uuid"
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
          :srcVideo="gifCovers[0].data.items[0].image.data.uuid"
          :srcWidth="gifCovers[0].data.items[0].image.data.width"
          :srcHeight="gifCovers[0].data.items[0].image.data.height"
          :maxWidth="640"
          :maxHeight="600"
        />
      </div>
      <router-link class="entry__link" :to="entry.id.toString()"></router-link>
    </div>

    <entry-footer
      class="e-island"
      :commentsCount="entry.counters.comments"
      :repostsCount="entry.counters.reposts"
      :favoritesCount="entry.counters.favorites"
      :entryRating="entry.likes"
      :entryId="entryId"
    />
  </div>
</template>

<script>
import EntryHeader from "@/components/Entry/EntryHeader.vue";
import EntryTitle from "@/components/Entry/EntryTitle.vue";
import EntrySubtitle from "@/components/Entry/EntrySubtitle.vue";
import EntryFooter from "@/components/Entry/EntryFooter.vue";
import ImageComponent from "@/components/ImageComponent.vue";
import VideoComponent from "@/components/VideoComponent.vue";
import TelegramComponent from "@/components/TelegramComponent.vue";
import TwitterComponent from "@/components/TwitterComponent.vue";
import InstagramEmbed from "@/components/InstagramEmbed.vue";
import RepostIcon from "@/assets/logos/repost_icon.svg?inline";
import LinkComponent from "@/components/LinkComponent.vue";
import QuoteComponent from "@/components/QuoteComponent.vue";
import { сalculateAspectRatio } from "@/utils/сalculateAspectRatio";

export default {
  components: {
    EntryHeader,
    EntryTitle,
    EntrySubtitle,
    EntryFooter,
    ImageComponent,
    VideoComponent,
    LinkComponent,
    TwitterComponent,
    TelegramComponent,
    InstagramEmbed,
    RepostIcon,
    QuoteComponent,
  },

  computed: {
    subtitleArr() {
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

    instagramCovers() {
      return this.entry.blocks.filter(
        (cover) => cover.type === "instagram" && cover.cover === true
      );
    },

    linkCovers() {
      return this.entry.blocks.filter(
        (cover) => cover.type === "link" && cover.cover === true
      );
    },

    quoteCovers() {
      return this.entry.blocks.filter(
        (cover) => cover.type === "quote" && cover.cover === true
      );
    },

    imageClassObject() {
      if (this.imageCovers.length > 0) {
        return {
          "entry-content__cover_vertical":
            this.imageCovers[0].data.items[0].image.data.height >
            this.imageCovers[0].data.items[0].image.data.width,
          "entry-content__cover_wide":
            this.imageCovers[0].data.items[0].image.data.width >=
              this.calculatedWidth && !this.imageCovers[0].data.with_background,
          "entry-content__cover_thin":
            this.imageCovers[0].data.items[0].image.data.width < 640 ||
            this.calculatedWidth < 640,
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
              this.videoCovers[0].data.video.data.width &&
            !this.videoCovers[0].data.with_background &&
            !Object.keys(this.videoCovers[0].data.video.data.external_service),
          "entry-content__cover_wide":
            this.videoCovers[0].data.video.data.width >= 640 &&
            !this.videoCovers[0].data.with_background,
          "entry-content__cover_thin":
            (this.videoCovers[0].data.video.data.width <= 640 ||
              this.videoCovers[0].data.video.data.width ===
                this.videoCovers[0].data.video.data.height) &&
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
            (this.gifCovers[0].data.items[0].image.data.width <= 640 ||
              this.gifCovers[0].data.items[0].image.data.width ===
                this.gifCovers[0].data.items[0].image.data.height) &&
            !this.gifCovers[0].data.with_background,
          "entry-content__cover_highlighted":
            this.gifCovers[0].data.with_background,
        };
      }
    },

    calculatedWidth() {
      if (this.imageCovers.length > 0) {
        const { width } = сalculateAspectRatio(
          this.imageCovers[0].data.items[0].image.data.width,
          this.imageCovers[0].data.items[0].image.data.height,
          640,
          600
        );

        return width;
      }
    },

    entryId() {
      return this.entry.id;
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
    margin-top: 16px;
    margin-bottom: 15px;
  }

  & .entry-title {
    margin-top: -4px;
    font-size: 22px;
    font-weight: 500;
    line-height: 32px;
  }

  & .entry-footer {
    padding-top: 11px;
    padding-right: 16px;
    padding-bottom: 11px;
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
  position: relative;
  word-break: break-word;
  line-height: 1.6em;

  & .embed,
  .link-block {
    margin-left: 20px;
    margin-right: 20px;
    position: relative;
    z-index: 1;
  }
}

.entry-content__title {
  & .entry-title__editorial-icon {
    & .icon {
      margin-left: 4px;
    }
  }

  & + .entry-content__subtitle {
    margin-top: 5px;
  }
}

.entry-content__subtitle {
  font-size: 17px;

  & p {
    & a {
      position: relative;
      z-index: 1;
    }

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
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

  & + .quote-component {
    margin-top: 12px;
  }
}

.entry-content__cover {
  &:not(:first-child) {
    margin-top: 12px;
  }

  &_thin {
    padding: var(--entry-thin-cover-gap);
  }

  &_wide {
    width: 100%;
  }

  &_vertical {
    padding: var(--entry-thin-cover-gap);

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
  top: 0;
  width: 100%;
  height: 100%;
}

.e-island {
  padding-left: 20px;
  padding-right: 20px;
}

@media screen and (max-width: 768px) {
  .e-island {
    padding-left: 15px;
    padding-right: 15px;
  }

  .entry-content {
    .embed,
    .link-block {
      margin-left: 15px;
      margin-right: 15px;
    }
  }
}

@media screen and (max-width: 640px) {
  .entry {
    border-radius: 0;
  }
}

@media screen and (max-width: 1430px) {
  .entry-header__subsite-data {
    justify-content: flex-start;
  }
}
</style>