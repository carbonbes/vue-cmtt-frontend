<template>
  <div class="entry-page-wrapp">
    <div class="entry-page">
      <div class="entry-page__header ep-island">
        <entry-header
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
          :dateType="1"
        />
      </div>
      <div class="entry-page__content">
        <div class="entry-page__title ep-island" v-if="entry.title">
          <entry-title :title="entry.title" :isEditorial="entry.isEditorial" />
        </div>
        <template v-for="(block, index) in entry.blocks" :key="index">
          <image-block
            :item="block"
            v-if="
              block.type === 'media' &&
              (block.data.items[0].image.data.type === 'jpg' ||
                block.data.items[0].image.data.type === 'png' ||
                block.data.items[0].image.data.type === 'webp')
            "
          />

          <video-block
            :item="block"
            type="default"
            v-if="
              block.type === 'media' &&
              block.data.items[0].image.data.type === 'gif'
            "
          />

          <video-block
            :item="block"
            type="video"
            v-if="block.type === 'video'"
          />

          <text-block :item="block" v-if="block.type === 'text'" />

          <div class="entry-page__embed" v-if="block.type === 'telegram'">
            <telegram-component
              :authorAvatar="block.data.telegram.data.tg_data.author.avatar_url"
              :authorName="block.data.telegram.data.tg_data.author.name"
              :dateTime="block.data.telegram.data.tg_data.datetime"
              :text="block.data.telegram.data.tg_data.text"
              :imgCover="
                block.data.telegram.data.tg_data.photos[0]?.leonardo_url
              "
              :videoCover="block.data.telegram.data.tg_data.videos[0]?.src"
            />
          </div>
        </template>
      </div>
      <div class="entry-page__footer ep-island">
        <entry-footer
          :commentsCount="entry.counters.comments"
          :repostsCount="entry.counters.reposts"
          :favoritesCount="entry.counters.favorites"
          :entryRating="entry.likes"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EntryHeader from "@/components/Entry/EntryHeader.vue";
import EntryTitle from "@/components/Entry/EntryTitle.vue";
import EntryFooter from "@/components/Entry/EntryFooter.vue";
import ImageBlock from "@/components/EntryPage/ImageBlock.vue";
import VideoBlock from "@/components/EntryPage/VideoBlock.vue";
import TextBlock from "@/components/EntryPage/TextBlock.vue";
import TwitterComponent from "@/components/TwitterComponent.vue";
import TelegramComponent from "@/components/TelegramComponent.vue";
import store from "@/store";
import nProgress from "nprogress";
import { mapGetters } from "vuex";

function requestEntry(routeTo, next) {
  nProgress.start();

  store
    .dispatch("requestEntry", routeTo.params.id)
    .then(() => {
      nProgress.done();
      next();
    })
    .catch((error) => {
      nProgress.done();
      next(false);
    });
}

export default {
  components: {
    EntryHeader,
    EntryTitle,
    EntryFooter,
    ImageBlock,
    VideoBlock,
    TextBlock,
    TwitterComponent,
    TelegramComponent,
  },

  computed: {
    ...mapGetters(["entry"]),
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    requestEntry(routeTo, next);
  },

  beforeRouteUpdate(routeTo, routeFrom, next) {
    requestEntry(routeTo, next);
  },

  unmounted() {
    store.commit("clearEntry");
  },
};
</script>

<style lang="scss">
.entry-page-wrapp {
  margin: 0 auto;
  max-width: 1020px;
}

.entry-page {
  padding-top: 30px;
  color: var(--black-color);
  background: var(--entry-bg-color);
  border-radius: 0 0 8px 8px;
}

.entry-page__header {
  padding-bottom: 15px;
}

.entry-page__title {
  & .entry-title {
    margin-bottom: 15px;
    font-size: 36px;
    font-weight: 500;
    line-height: 1.3em;

    &__editorial-icon {
      & .icon {
        margin-left: 7px;
      }
    }
  }

  & + .entry-page__img-block {
    margin-top: 0;
  }

  & + .entry-page__embed {
    margin-top: 12px;
  }
}

.entry-page__content {
  font-size: 18px;
  line-height: 1.6em;
  word-break: break-word;
}

.entry-page__footer {
  padding-top: 15px;
  padding-bottom: 30px;
}

.entry-page__embed {
  margin-left: auto;
  margin-right: auto;
  max-width: 680px;

  &:not(:first-child) {
    margin-top: 30px;
  }
}

.ep-island {
  margin: 0 auto;
  max-width: 680px;
}

@media screen and (max-width: 768px) {
  .entry-page {
    padding-top: 15px;
  }

  .entry-page__title {
    & .entry-title {
      font-size: 28px;
    }
  }

  .entry-page__embed {
    &:not(:first-child) {
      margin-top: 15px;
    }
  }

  .ep-island {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>