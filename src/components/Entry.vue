<template>
  <div class="entry">
    <div class="entry-repost-data e-island" v-if="entry.repost">
      <div class="entry-repost__icon"><refresh-cw-icon class="icon" /></div>
      <span class="entry-repost__name"
        >{{ entry.repost.author.name }} сделал репост</span
      >
    </div>
    <div class="e-island">
      <div class="entry-header">
        <entry-header
          :subsiteType="entry.subsite.type"
          :subsiteId="entry.subsite.id"
          :subsiteAvatar="entry.subsite.avatar.data.uuid"
          :subsiteName="entry.subsite.name"
          :authorType="entry.author.type"
          :authorId="entry.author.id"
          :authorName="entry.author.name"
          :date="entry.date"
        />
      </div>
    </div>
    <div class="entry-content">
      <div class="e-island">
        <div class="entry-content__title" v-if="entry.title">
          <entry-title :title="entry.title" :isEditorial="entry.isEditorial" />
        </div>
        <div class="entry-content__subtitle" v-if="subtitle.length > 0">
          {{ subtitle[0].data.text }}
        </div>
        <telegram-embed
          :data="telegramCovers"
          v-if="telegramCovers.length > 0"
        />
        <link-block :data="linkCovers" v-if="linkCovers.length > 0" />
      </div>
      <div
        class="entry-content__cover cover"
        :class="imageClassObject"
        v-if="imageCovers.length > 0"
      >
        <Image
          :image="imageCovers"
          :type="1"
          :maxWidth="640"
          :maxHeight="600"
        />
      </div>
      <div
        class="entry-content__cover cover"
        :class="videoClassObject"
        v-if="videoCovers.length > 0"
      >
        <Video
          :video="videoCovers"
          :srcWidth="videoCovers[0].data.video.data.width"
          :srcHeight="videoCovers[0].data.video.data.height"
          :maxWidth="640"
          :maxHeight="600"
          type="1"
          :externalService="videoCovers[0].data.video.data.external_service"
          v-if="videoCovers.length > 0"
        />
      </div>
      <div
        class="entry-content__cover cover"
        :class="gifClassObject"
        v-if="gifCovers.length > 0"
      >
        <Video
          :video="gifCovers[0].data.items[0].image.data.uuid"
          :srcWidth="gifCovers[0].data.items[0].image.data.width"
          :srcHeight="gifCovers[0].data.items[0].image.data.height"
          :maxWidth="640"
          :maxHeight="600"
          type="1"
          v-if="gifCovers.length > 0"
        />
      </div>
    </div>
    <div class="e-island">
      <entry-footer
        :commentsCount="entry.counters.comments"
        :repostsCount="entry.counters.reposts"
        :favoritesCount="entry.counters.favorites"
        :entryRating="entry.likes"
      />
    </div>
  </div>
</template>

<script>
import EntryHeader from "@/components/EntryHeader.vue";
import EntryTitle from "@/components/EntryTitle.vue";
import EntryFooter from "@/components/EntryFooter.vue";
import Image from "@/components/Image.vue";
import Video from "@/components/Video.vue";
import TelegramEmbed from "@/components/TelegramEmbed.vue";
import { RefreshCwIcon } from "@zhuowenli/vue-feather-icons";
import LinkBlock from "./LinkBlock.vue";

export default {
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

    linkCovers() {
      return this.entry.blocks.filter(
        (cover) => cover.type === "link" && cover.cover === true
      );
    },

    imageClassObject() {
      return {
        cover_vertical:
          this.imageCovers[0].data.items[0].image.data.height >
          this.imageCovers[0].data.items[0].image.data.width,
        cover_wide:
          this.imageCovers[0].data.items[0].image.data.width > 640 &&
          !this.imageCovers[0].data.with_background,
        cover_thin:
          this.imageCovers[0].data.items[0].image.data.width < 640 &&
          !this.imageCovers[0].data.with_background,
        cover_highlighted: this.imageCovers[0].data.with_background,
      };
    },

    videoClassObject() {
      return {
        cover_vertical:
          this.videoCovers[0]?.data.video.data.height >
          this.videoCovers[0]?.data.video.data.width,
        cover_wide:
          this.videoCovers[0]?.data.video.data.width > 640 &&
          !this.videoCovers[0]?.data.with_background,
        cover_thin:
          this.videoCovers[0]?.data.video.data.width < 640 &&
          !this.videoCovers[0]?.data.with_background,
        cover_highlighted: this.videoCovers[0]?.data.with_background,
      };
    },

    /* gifClassObject() {
      return {
        cover_vertical:
          this.gifCovers[0].data.items[0].image.data.height >
          this.gifCovers[0].data.items[0].image.data.width,
        cover_wide:
          this.videoCovers[0]?.data.video.data.width > 640 &&
          !this.gifCovers[0].data.items[0].image.data.width,
        cover_thin:
          this.gifCovers[0].data.items[0].image.data.width < 640 &&
          !this.gifCovers[0].data.with_background,
        cover_highlighted: this.gifCovers[0].data.with_background,
      };
    }, */
  },

  components: {
    EntryHeader,
    EntryTitle,
    EntryFooter,
    Image,
    Video,
    TelegramEmbed,
    RefreshCwIcon,
    LinkBlock,
  },

  props: {
    entry: Object,
  },
};
</script>

<style lang="scss">
.entry {
  max-width: 640px;
  display: flex;
  flex-flow: column;
  background: var(--entry-bg-color);
  border-radius: 8px;
  user-select: none;

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
    margin-top: 15px;
    margin-bottom: 15px;
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
}

.entry-repost__icon .icon {
  width: 18px;
  height: 18px;
  color: var(--grey-color);
}

.entry-repost__name {
  color: var(--grey-color);
}

.entry-content {
  word-break: break-word;
  line-height: 1.5em;
}

.entry-content__title {
  & ~ .embed {
    margin-top: 15px;
  }
}

.entry-content__title {
  & ~ .entry-content__subtitle {
    margin-top: 5px;
  }
}

.entry-content__subtitle {
  & ~ .entry-content__cover {
    margin-top: 10px;
  }
}

.e-island {
  margin-left: 20px;
  margin-right: 20px;
}

@media screen and (max-width: 768px) {
  .e-island {
    margin-left: 15px;
    margin-right: 15px;
  }

  .entry {
    border-radius: 0;
  }
}
</style>