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
      <div class="e-island" v-if="entry.title">
        <div class="entry-content__title">
          <entry-title :title="entry.title" />
        </div>
      </div>
      <div class="e-island" v-if="subtitle.length > 0">
        <div class="entry-content__subtitle">
          {{ subtitle[0].data.text }}
        </div>
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
        <Video :video="videoCovers" type="1" :maxWidth="640" :maxHeight="600" />
      </div>
      <div class="e-island" v-if="telegramCovers.length > 0">
        <telegram-embed :data="telegramCovers" />
      </div>
      <div class="e-island" v-if="linkCovers.length > 0">
        <link-block :data="linkCovers" />
      </div>
    </div>
    <entry-footer
      :commentsCount="entry.counters.comments"
      :repostsCount="entry.counters.reposts"
      :favoritesCount="entry.counters.favorites"
      :entryRating="entry.likes"
    />
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
  methods: {
    imageClassObject() {
      if (this.imageCovers.length > 0) {
        return {
          cover_vertical:
            this.imageCovers[0].data.items[0].covers.data.height >
            this.imageCovers[0].data.items[0].covers.data.width,
          cover_wide:
            this.imageCovers[0].data.items[0].covers.data.width > 640 &&
            !this.imageCovers[0].data.with_background,
          cover_vertical:
            this.imageCovers[0].data.items[0].covers.data.height >
            this.imageCovers[0].data.items[0].covers.data.width,
          cover_thin:
            this.imageCovers[0].data.items[0].covers.data.width < 640 &&
            !this.imageCovers[0].data.with_background,
          cover_highlighted: this.imageCovers[0].data.with_background,
        };
      }
    },

    videoClassObject() {
      if (this.videoCovers.length > 0) {
        return {
          cover_vertical:
            this.videoCovers[0].data.video.data.height >
            this.videoCovers[0].data.video.data.width,
          cover_wide:
            this.videoCovers[0].data.video.data.width > 640 &&
            !this.videoCovers[0].data.with_background,
          cover_vertical:
            this.videoCovers[0].data.video.data.height >
            this.videoCovers[0].data.video.data.width,
          cover_thin:
            this.videoCovers[0].data.video.data.width < 640 &&
            !this.videoCovers[0].data.with_background,
          cover_highlighted: this.videoCovers[0].data.with_background,
        };
      }
    },
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
      return this.entry.blocks.filter((cover) => cover.type === "telegram");
    },

    linkCovers() {
      return this.entry.blocks.filter((cover) => cover.type === "link");
    },
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

<style>
.e-island {
  margin-left: 20px;
  margin-right: 20px;
}

.entry {
  max-width: 640px;
  display: flex;
  flex-flow: column;
  background: var(--entry-bg-color);
  border-radius: 8px;
  user-select: none;
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
  margin-bottom: 7px;
}

.entry .entry-title {
  font-size: 22px;
  font-weight: 500;
  line-height: 1.3em;
}

.entry-content__cover {
  margin-top: 12px;
}

.entry .entry-header {
  margin-top: 16px;
  margin-bottom: 10px;
}

.entry .entry-footer {
  margin-top: 15px;
  margin-bottom: 15px;
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