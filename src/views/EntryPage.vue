<template>
  <div class="entry-page-wrapp">
    <div class="entry-page ep-island">
      <div class="entry-page__header">
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
        <entry-title :title="entry.title" :isEditorial="entry.isEditorial" />
      </div>
      <div class="entry-page__footer">
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
import store from "@/store";
import nProgress from "nprogress";
import { mapGetters } from "vuex";

export default {
  components: {
    EntryHeader,
    EntryTitle,
    EntryFooter,
  },

  computed: {
    ...mapGetters(["entry"]),
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    nProgress.start();

    store.dispatch("requestEntry", routeTo.params.id).then(() => {
      nProgress.done();
      next();
    });
  },

  beforeRouteUpdate(routeTo, routeFrom, next) {
    nProgress.start();

    store.dispatch("requestEntry", routeTo.params.id).then(() => {
      nProgress.done();
      next();
    });
  },

  beforeRouteLeave() {
    store.commit("clearEntry");
  },
};
</script>

<style lang="scss">
.entry-page-wrapp {
  margin: 0 auto;
  padding-top: 30px;
  max-width: 1020px;
  color: var(--black-color);
  background: var(--entry-bg-color);
}

.entry-page {
}

.entry-page__header {
  margin-bottom: 15px;
}

.entry-page__content {
  & .entry-title {
    font-size: 36px;
    font-weight: 500;
    line-height: 1.3em;
  }
}

.ep-island {
  margin: 0 auto;
  max-width: 680px;
}
</style>