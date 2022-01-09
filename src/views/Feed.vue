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

export default {
  data() {
    return {
      currentPage: 1,
    };
  },

  components: {
    Entry,
  },

  methods: {
    requestFeed() {
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
    nProgress.start();

    next((vm) => {
      store
        .dispatch("requestFeed", {
          sorting: !routeTo.params.sorting
            ? vm.savedSorting
            : routeTo.params.sorting,
          prevSorting: routeFrom.params.sorting,
        })
        .then(() => {
          nProgress.done();
        });
    });
  },

  beforeRouteUpdate(routeTo, routeFrom, next) {
    nProgress.start();

    store
      .dispatch("requestFeed", {
        sorting: routeTo.params.sorting,
        prevSorting: routeFrom.sorting,
      })
      .then(() => {
        nProgress.done();
        next();
      });
  },

  beforeRouteLeave() {
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
