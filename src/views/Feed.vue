<template>
  <div class="feed-page">
    <div class="feed-page__header"></div>
    <div class="feed-page__content">
      <entry v-for="entry in feed" :entry="entry" :key="entry.id" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Entry from "@/components/Entry.vue";
import store from "@/store";
import nProgress from "nprogress";

function requestFeed(routeTo, next) {
  nProgress.start();
  store
    .dispatch("requestFeed", {
      sorting: routeTo.params.sorting === "new" ? "date" : null,
    })
    .then(() => {
      nProgress.done();
      next();
    });
}

export default {
  data() {
    return {
      currentPage: 1,
    };
  },

  props: {
    sorting: String,
  },

  components: {
    Entry,
  },

  computed: {
    ...mapGetters(["feed"]),
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    requestFeed(routeTo, next);
  },

  beforeRouteUpdate(routeTo, routeFrom, next) {
    requestFeed(routeTo, next);
  },
};
</script>

<style>
.feed-page {
  margin-top: 12px;
}

.feed-page__content {
  margin: 0 auto;
  max-width: 640px;
}

.feed-page__content .entry {
  margin-bottom: 30px;
}
</style>
