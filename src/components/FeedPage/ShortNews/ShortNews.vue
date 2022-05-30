<script setup>
import { reactive, computed, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import Loader from "@/components/Loader.vue";
import ShortNewsItem from "./ShortNewsItem.vue";

const store = useStore();

// state
const state = reactive({
  isRequested: false,
  isNextPageRequested: false,
});

// beforeMounted
onBeforeMount(() => {
  state.isRequested = true;

  store.dispatch("requestShortNews").then(() => {
    state.isRequested = false;
  });
});

onBeforeUnmount(() => {
  store.commit("clearShortNews");
});

// computed
const news = computed(() => store.getters.shortNews);
const lastId = computed(() => store.getters.shortNewsLastId);
const isRequested = computed(() => state.isRequested);
const isNextPageRequested = computed(() => state.isNextPageRequested);

const componentClassObj = computed(() => ({
  "feed-page__short-news_requested": isRequested.value,
}));

// methods
const requestNextPage = () => {
  state.isNextPageRequested = true;

  store.dispatch("requestShortNews", { lastId: lastId.value }).then(() => {
    state.isNextPageRequested = false;
  });
};
</script>

<template>
  <div class="feed-page__short-news" :class="componentClassObj">
    <div class="loader" v-if="isRequested"><Loader /></div>
    <div class="news-content" v-if="!isRequested">
      <ShortNewsItem v-for="item in news" :item="item" :key="item.id" />
      <div class="show-more-btn" @click="requestNextPage">
        <template v-if="!isNextPageRequested">
          <span class="label">Показать еще...</span>
        </template>
        <template v-if="isNextPageRequested">
          <div class="loader"><Loader /></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.feed-page {
  &__short-news {
    --b-rad: 8px;

    position: relative;
    margin-top: 15px;
    margin-bottom: 30px;
    color: var(--black-color);
    background: var(--entry-bg-color);
    font-size: 17px;
    line-height: 26px;
    border-radius: var(--b-rad);

    &_requested {
      height: 250px;
    }

    & > .loader {
      top: 0;
      padding: 125px 0;

      & .custom-loader {
        &__loader-1,
        &__loader-2,
        &__loader-3 {
          background-color: var(--black-color);
        }
      }
    }

    & .news-content {
      position: relative;
      padding: 20px;

      &__item {
        &:not(:first-child) {
          margin-top: 10px;
        }

        & .link {
          margin-right: 7px;
          line-height: 26px;
        }

        & .comments-count {
          display: inline-flex;
          align-items: center;
          color: var(--grey-color);
          font-size: 15px;
          line-height: 16px;
          vertical-align: middle;

          & > .icon {
            width: 16px;
            height: 16px;
          }

          & > .count {
            margin-left: 3px;
            font-size: 13px;
            font-weight: 500;
          }
        }
      }

      & .show-more-btn {
        margin-top: 10px;
        display: inline-block;
        color: var(--blue-color);
        cursor: pointer;

        & > .label {
          font-size: 16px;
          font-weight: 500;
        }

        & > .loader {
          position: relative;
          margin-top: 10px;
          line-height: 26px;

          & .custom-loader {
            margin: 0;

            &__loader-1,
            &__loader-2,
            &__loader-3 {
              background-color: var(--black-color);
            }
          }
        }
      }
    }
  }
}

@media (hover: hover) {
  .feed-page {
    &__short-news {
      & .news-content {
        &__item {
          & .link,
          & .comments-count {
            &:hover {
              color: var(--blue-color);
            }
          }
        }

        & .show-more-btn {
          &:hover {
            color: var(--red-color);
          }
        }
      }
    }
  }
}

@media (max-width: 641px) {
  .feed-page {
    &__short-news {
      --b-rad: 0;
    }
  }
}
</style>