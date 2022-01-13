<template>
  <div class="entry-page-wrapp">
    <div class="entry-page">
      <div class="entry-page__header ep-island">
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
      <div class="entry-page__content">
        <div class="entry-page__title" v-if="entry.title">
          <entry-title
            class="ep-island"
            :title="entry.title"
            :isEditorial="entry.isEditorial"
          />
        </div>
        <template v-for="(block, index) in entry.blocks" :key="index">
          <div
            class="entry-page__img-block"
            v-if="
              block.type === 'media' &&
              (block.data.items[0].image.data.type === 'jpg' ||
                block.data.items[0].image.data.type === 'png' ||
                block.data.items[0].image.data.type === 'webp') &&
              block.cover
            "
          >
            <Image
              :image="block.data.items[0].image"
              :type="2"
              :srcWidth="block.data.items[0].image.data.width"
              :srcHeight="block.data.items[0].image.data.height"
              :maxWidth="1020"
              :maxHeight="1500"
            />
          </div>
          <div
            class="entry-page__text-block ep-island"
            v-if="block.type === 'text' && block.cover"
          >
            <p>{{ block.data.text }}</p>
          </div>
          <div
            class="entry-page__text-block ep-island"
            v-if="block.type === 'text' && !block.cover"
          >
            <p>{{ block.data.text }}</p>
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
import EntryHeader from "@/components/EntryHeader.vue";
import EntryTitle from "@/components/EntryTitle.vue";
import EntryFooter from "@/components/EntryFooter.vue";
import Image from "@/components/Image.vue";
import store from "@/store";
import nProgress from "nprogress";
import { mapGetters } from "vuex";

function requestEntry(routeTo, next) {
  nProgress.start();

  store.dispatch("requestEntry", routeTo.params.id).then(() => {
    nProgress.done();
    next();
  });
}

export default {
  components: {
    EntryHeader,
    EntryTitle,
    EntryFooter,
    Image,
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
  color: var(--black-color);
  background: var(--entry-bg-color);
}

.entry-page {
  padding-top: 30px;
}

.entry-page__header {
  padding-bottom: 15px;
}

.entry-page__title {
  & .entry-title {
    font-size: 36px;
    font-weight: 500;
    line-height: 1.3em;
  }
}

.entry-page__content {
  font-size: 18px;
  line-height: 1.6em;
  word-break: break-word;
}

.entry-page__text-block:first-child {
  & p {
    margin-top: 0;
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

  .ep-island {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>