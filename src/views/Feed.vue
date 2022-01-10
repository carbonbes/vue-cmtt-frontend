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

function requestFeed(routeTo, routeFrom, next) {
  nProgress.start();

  store
    .dispatch("requestFeed", {
      sorting: routeTo.params.sorting,
      prevSorting: routeFrom.params.sorting,
    })
    .then(() => {
      nProgress.done();
      next();
    });
}

export default {
  data() {
    return {
      currentSorting: null,
      currentPage: 1,
    };
  },

  components: {
    Entry,
  },

  methods: {
    requestNextPage() {
      store.dispatch("requestFeed", {
        sorting: this.currentSorting,
        lastId,
      });
    },
  },

  computed: {
    ...mapGetters(["feed", "lastId"]),

    savedSorting() {
      let sorting = localStorage.getItem("saved-sorting");

      if (sorting === "" || !sorting) {
        return "hotness";
      } else return "date";
    },
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    requestFeed(routeTo, routeFrom, next);
  },

  beforeRouteUpdate(routeTo, routeFrom, next) {
    requestFeed(routeTo, routeFrom, next);
  },

  unmounted() {
    store.commit("clearFeed");
  },
};
</script>

<style lang="scss">
.feed-page {
  margin-top: 12px;
}

.feed-page__content {
  margin: 0 auto;
  max-width: 640px;

  & .entry {
    margin-bottom: 30px;
  }
}
</style>
