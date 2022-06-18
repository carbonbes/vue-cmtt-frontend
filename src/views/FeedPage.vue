<template>
  <div class="feed-page">
    <div class="feed-page__header">
      <div
        class="feed-page__sorting-selector"
        v-outside-click:[true]="closeFeedSorting"
      >
        <div class="selector-btn" @click="toggleFeedSortingVisible">
          <div class="label" v-text="sortingSelectorLabel"></div>
          <chevron-down-icon class="icon" />
        </div>
        <transition name="selector__dropdown"
          ><div class="selector__dropdown" v-if="feedSortingSelectorIsOpen">
            <Dropdown :data="dropdownConfig" /></div
        ></transition>
      </div>
      <ShortNews v-if="shortNewsCondition" />
    </div>
    <div class="feed-page__content">
      <NewArticlesBtn
        :newArticles="newArticlesCount"
        :requestFeed="requestNewFeed"
        v-if="isNewAllSite && newArticlesCount > 0"
      />
      <template v-for="(entry, index) in feed" :key="entry.id">
        <ArticleComponent
          :article="entry"
          type="feedArticle"
          v-if="feed.length !== index + 1"
        />

        <ArticleComponent
          :article="entry"
          type="feedArticle"
          v-intersect="{
            type: 'when-appears',
            threshold: 0,
            callback: this.requestNextPage,
          }"
          v-else
        />
      </template>

      <div class="feed-loader"><Loader color="var(--black-color)" /></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ArticleComponent from "../components/Article/ArticleComponent.vue";
import ShortNews from "../components/FeedPage/ShortNews/ShortNews.vue";
import NewArticlesBtn from "../components/FeedPage/NewArticlesBtn.vue";
import store from "@/store";
import nProgress from "nprogress";
import Loader from "@/components/Loader";
import Dropdown from "@/components/Dropdown/Dropdown.vue";
import ChevronDownIcon from "@/assets/logos/chevron-down_icon.svg?inline";

function requestFeed(routeTo, routeFrom, next) {
  nProgress.start();

  return store
    .dispatch("requestFeed", {
      params: {
        pageName: routeTo.params.pageName,
        sorting:
          routeTo.params.pageName === "new" && !routeTo.params.sorting
            ? "from-10"
            : (routeTo.params.pageName === "popular" ||
                routeTo.params.pageName === "my") &&
              !routeTo.params.sorting
            ? "hotness"
            : routeTo.params.sorting,
      },
      clear:
        routeFrom.params.pageName !== routeTo.params.pageName ||
        routeFrom.params.sorting !== routeTo.params.sorting,
    })
    .then(() => {
      nProgress.done();
      store.commit("closeStartScreen");
      store.commit("clearCountNewArticles");
      next((vm) => {
        if (window.matchMedia("(max-width: 1219px)").matches) {
          vm.emitter.emit("left-sidebar-hide");
        }
      });
    });
}

export default {
  components: {
    ArticleComponent,
    ShortNews,
    NewArticlesBtn,
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
            type: "link",
            activeClassPathes: ["/my", "/my/hotness"],
          },
          {
            label: "Свежее",
            path: "/my/new",
            type: "link",
            activeClassPathes: ["/my/new"],
          },
        ],
      },

      allFeedPopularDropdownSettings: {
        items: [
          {
            label: "За сегодня",
            path: "/popular/hotness",
            type: "link",
            activeClassPathes: ["/popular", "/popular/hotness"],
          },
          {
            label: "За 24 часа",
            path: "/popular/day",
            type: "link",
            activeClassPathes: ["/popular/day"],
          },
          {
            label: "За неделю",
            path: "/popular/week",
            type: "link",
            activeClassPathes: ["/popular/week"],
          },
          {
            label: "За месяц",
            path: "/popular/month",
            type: "link",
            activeClassPathes: ["/popular/month"],
          },
          {
            label: "За год",
            path: "/popular/year",
            type: "link",
            activeClassPathes: ["/popular/year"],
          },
          {
            label: "За все время",
            path: "/popular/all",
            type: "link",
            activeClassPathes: ["/popular/all"],
          },
        ],
      },

      allFeedNewDropdownSettings: {
        items: [
          {
            label: "От -10",
            path: "/new/from-10",
            type: "link",
            activeClassPathes: ["/new", "/new/from-10"],
          },
          {
            label: "От +5",
            path: "/new/from5",
            type: "link",
            activeClassPathes: ["/new/from5"],
          },
          {
            label: "От +10",
            path: "/new/from10",
            type: "link",
            activeClassPathes: ["/new/from10"],
          },
          {
            label: "Все",
            path: "/new/all",
            type: "link",
            activeClassPathes: ["/new/all"],
          },
        ],
      },
    };
  },

  methods: {
    requestNewFeed() {
      nProgress.start();

      store
        .dispatch("requestFeed", {
          params: {
            pageName: "new",
            sorting: !this.currentSorting ? "from-10" : this.currentSorting,
          },
          clear: true,
        })
        .then(() => {
          nProgress.done();
          store.commit("clearCountNewArticles");
        });
    },

    requestNextPage() {
      store.dispatch("requestFeed", {
        params: {
          pageName: this.pageName,
          sorting: this.currentSorting,
          lastId: this.lastId,
          lastSortingValue: this.lastSortingValue,
        },
        nextPage: true,
      });
    },

    toggleFeedSortingVisible() {
      this.feedSortingSelectorIsOpen = !this.feedSortingSelectorIsOpen;
    },

    closeFeedSorting() {
      this.feedSortingSelectorIsOpen = false;
    },
  },

  computed: {
    ...mapGetters([
      "feed",
      "lastId",
      "lastSortingValue",
      "feedIsRequested",
      "newArticlesCount",
    ]),

    pageName() {
      return this.$route.params.pageName;
    },

    currentSorting() {
      if (
        this.$route.params.pageName === "popular" ||
        this.$route.params.pageName === "my"
      ) {
        if (this.$route.params.sorting) {
          return this.$route.params.sorting;
        } else return "hotness";
      } else if (this.$route.params.pageName === "new") {
        if (this.$route.params.sorting) {
          return this.$route.params.sorting;
        } else return "from-10";
      }
    },

    isNewAllSite() {
      return this.$route.params.pageName === "new";
    },

    dropdownConfig() {
      if (
        this.$route.path === "/popular" ||
        this.$route.path === "/popular/hotness" ||
        this.$route.path === "/popular/day" ||
        this.$route.path === "/popular/week" ||
        this.$route.path === "/popular/month" ||
        this.$route.path === "/popular/year" ||
        this.$route.path === "/popular/all"
      ) {
        return this.allFeedPopularDropdownSettings;
      } else if (
        this.$route.path === "/new" ||
        this.$route.path === "/new/from-10" ||
        this.$route.path === "/new/from5" ||
        this.$route.path === "/new/from10" ||
        this.$route.path === "/new/all"
      ) {
        return this.allFeedNewDropdownSettings;
      } else if (
        this.$route.path === "/my" ||
        this.$route.path === "/my/hotness" ||
        this.$route.path === "/my/new"
      ) {
        return this.myFeedDropdownSettings;
      }
    },

    sortingSelectorLabel() {
      if (
        this.$route.path === "/popular" ||
        this.$route.path === "/popular/hotness"
      ) {
        return "За сегодня";
      } else if (this.$route.path === "/popular/new") {
        return "Свежее";
      } else if (this.$route.path === "/popular/day") {
        return "За 24 часа";
      } else if (this.$route.path === "/popular/week") {
        return "За неделю";
      } else if (this.$route.path === "/popular/month") {
        return "За месяц";
      } else if (this.$route.path === "/popular/year") {
        return "За год";
      } else if (this.$route.path === "/popular/all") {
        return "За все время";
      } else if (
        this.$route.path === "/new" ||
        this.$route.path === "/new/from-10"
      ) {
        return "От -10";
      } else if (this.$route.path === "/new/from5") {
        return "От +5";
      } else if (this.$route.path === "/new/from10") {
        return "От +10";
      } else if (this.$route.path === "/new/all") {
        return "Все";
      } else if (
        this.$route.path === "/my" ||
        this.$route.path === "/my/hotness"
      ) {
        return "Популярное";
      } else if (this.$route.path === "/my/new") {
        return "Свежее";
      }
    },

    shortNewsCondition() {
      return (
        this.pageName === "popular" &&
        (this.currentSorting === "hotness" || this.currentSorting === "")
      );
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
    margin-top: 15px;
    margin-bottom: 15px;

    .feed-page__sorting-selector {
      position: relative;
      margin-left: 15px;
      display: inline-block;
      color: var(--black-color);
      user-select: none;

      .selector-btn {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .icon {
        margin-left: 3px;
        width: 16px;
        height: 16px;
      }

      .selector__dropdown {
        position: absolute;
        top: 100%;
        margin-top: 5px;
        width: 175px;
        z-index: 3;

        &-enter-active,
        &-leave-active {
          transition: all 100ms;
        }

        &-enter-from,
        &-leave-to {
          opacity: 0;
        }
      }
    }
  }
}

.feed-page__content,
.feed-page__header {
  margin-left: auto;
  margin-right: auto;
  max-width: 640px;

  .article-component,
  .feed-loader {
    margin-bottom: 30px;
  }
}
</style>
