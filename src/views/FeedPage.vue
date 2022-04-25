<template>
  <div class="feed-page">
    <div class="feed-page__header">
      <div
        class="feed-page__sorting-selector"
        v-if="sortingSelectorVisible"
        v-outside-click:[true]="closeFeedSorting"
      >
        <div class="selector-btn" @click="toggleFeedSortingVisible">
          <div class="label" v-text="sortingSelectorLabel"></div>
          <chevron-down-icon class="icon" />
        </div>
        <div class="selector__dropdown" v-if="feedSortingSelectorIsOpen">
          <dropdown :data="dropdownData" />
        </div>
      </div>
    </div>
    <div class="feed-page__content">
      <entry
        v-for="(entry, index) in feed"
        :entry="entry"
        :key="entry.id"
        v-intersect="
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
import Dropdown from "@/components/Dropdown/Dropdown.vue";
import ChevronDownIcon from "@/assets/logos/chevron-down_icon.svg?inline";

function requestFeed(routeTo, routeFrom, next) {
  nProgress.start();

  return store
    .dispatch("requestFeed", {
      allSite: routeTo.params.allSite,
      sorting: routeTo.params.sorting,
      prevAllSite: routeFrom.params.allSite,
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
    Dropdown,
    ChevronDownIcon,
  },

  data() {
    return {
      feedSortingSelectorIsOpen: false,

      myFeedDropdownSettings: {
        items: [
          {
            label: "Популярное",
            path: "/my/popular",
            action: this.saveFeedSorting,
            actionInfo: { allSite: "my", sorting: "hotness" },
          },
          {
            label: "Свежее",
            path: "/my/new",
            action: this.saveFeedSorting,
            actionInfo: { allSite: "my", sorting: "date" },
          },
        ],
      },

      allFeedDropdownSettings: {
        items: [
          { label: "За сегодня", path: "/all/popular" },
          { label: "За 24 часа", path: "/all/day" },
          { label: "За неделю", path: "/all/week" },
          { label: "За месяц", path: "/all/month" },
          { label: "За год", path: "/all/year" },
          { label: "За все время", path: "/all/all" },
        ],
      },
    };
  },

  methods: {
    requestNextPage() {
      store.dispatch("requestFeed", {
        allSite: this.allSite,
        sorting: this.currentSorting,
        lastId: this.lastId,
        nextPage: true,
      });
    },

    toggleFeedSortingVisible() {
      this.feedSortingSelectorIsOpen = !this.feedSortingSelectorIsOpen;
    },

    closeFeedSorting() {
      this.feedSortingSelectorIsOpen = false;
    },

    saveFeedSorting(data) {
      if (data.allSite === "all") {
        localStorage.setItem("all-saved-sorting", data.sorting);
        localStorage.setItem("allSite", "all");
      } else if (data.allSite === "my") {
        localStorage.setItem("my-saved-sorting", data.sorting);
        localStorage.setItem("allSite", "my");
      }
    },
  },

  computed: {
    ...mapGetters(["feed", "lastId", "feedIsRequested"]),

    allSite() {
      return this.$route.params.allSite;
    },

    currentSorting() {
      return this.$route.params.sorting;
    },

    dropdownData() {
      if (
        this.$route.path === "/" ||
        this.$route.path === "/all/new" ||
        this.$route.path === "/all/popular" ||
        this.$route.path === "/all/day" ||
        this.$route.path === "/all/week" ||
        this.$route.path === "/all/month" ||
        this.$route.path === "/all/year" ||
        this.$route.path === "/all/all"
      ) {
        return this.allFeedDropdownSettings;
      } else if (
        this.$route.path === "/my" ||
        this.$route.path === "/my/popular" ||
        this.$route.path === "/my/new"
      ) {
        return this.myFeedDropdownSettings;
      }
    },

    sortingSelectorVisible() {
      return this.$route.path !== "/all/new";
    },

    sortingSelectorLabel() {
      if (this.$route.path === "/all/popular") {
        return "За сегодня";
      } else if (this.$route.path === "/all/new") {
        return "Свежее";
      } else if (this.$route.path === "/all/day") {
        return "За 24 часа";
      } else if (this.$route.path === "/all/week") {
        return "За неделю";
      } else if (this.$route.path === "/all/month") {
        return "За месяц";
      } else if (this.$route.path === "/all/year") {
        return "За год";
      } else if (this.$route.path === "/all/all") {
        return "За все время";
      } else if (
        this.$route.path === "/my/popular" ||
        this.$route.path === "/my"
      ) {
        return "Популярное";
      } else if (this.$route.path === "/my/new") {
        return "Свежее";
      }
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

      this.closeFeedSorting();
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

  &__header {
    margin-top: 20px;
    margin-bottom: 15px;

    & .feed-page__sorting-selector {
      position: relative;
      margin-left: 15px;
      display: inline-block;
      color: var(--black-color);

      & .selector-btn {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      & .icon {
        margin-left: 3px;
        width: 16px;
        height: 16px;
      }

      & .selector__dropdown {
        position: absolute;
        top: 100%;
        margin-top: 5px;
        width: 175px;
        z-index: 3;
      }
    }
  }
}

.feed-page__content,
.feed-page__header {
  margin-left: auto;
  margin-right: auto;
  max-width: 640px;

  & .entry,
  .feed-loader {
    margin-bottom: 30px;

    & .custom-loader {
      &__loader-1,
      &__loader-2,
      &__loader-3 {
        background-color: var(--black-color);
      }
    }
  }
}
</style>
