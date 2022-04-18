<template>
  <div class="feed-page">
    <div class="feed-page__header"></div>
    <div class="feed-page__content">
      <entry
        v-for="(entry, index) in feed"
        :entry="entry"
        :key="entry.id"
        v-on-view="
          feed.length === index + 1 && {
            requestState: feedIsRequested,
            callback: this.requestNextPage,
          }
        "
      />
      <div class="feed-loader"><loader /></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Entry from "@/components/Entry/Entry.vue";
import store from "@/store";
import nProgress from "nprogress";
import Loader from "@/components/Loader";

function requestFeed(routeTo, routeFrom, next) {
  nProgress.start();

  return store
    .dispatch("requestFeed", {
      sorting: routeTo.params.sorting,
      prevSorting: routeFrom.params.sorting,
    })
    .then(() => {
      nProgress.done();
      next((vm) => {
        if (window.matchMedia("(max-width: 1219px)").matches) {
          vm.emitter.emit("left-sidebar-hide");
        }
      });
    });
}

export default {
  components: {
    Entry,
    Loader,
  },

  methods: {
    requestNextPage() {
      store.dispatch("requestFeed", {
        sorting: this.currentSorting,
        lastId: this.lastId,
        nextPage: true,
      });
    },
  },

  computed: {
    ...mapGetters(["feed", "lastId", "feedIsRequested"]),

    currentSorting() {
      return this.$route.params.sorting;
    },
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    requestFeed(routeTo, routeFrom, next);
  },

  beforeRouteUpdate(routeTo, routeFrom, next) {
    requestFeed(routeTo, routeFrom, next).then(() => {
      if (window.matchMedia("(max-width: 1219px)").matches) {
        this.emitter.emit("left-sidebar-hide");
      }
    });
  },

  mounted() {
    document.title = "Лента";
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
    max-width: 640px;
  }

  & .entry,
  .feed-loader {
    margin-bottom: 30px;
  }
}
</style>
