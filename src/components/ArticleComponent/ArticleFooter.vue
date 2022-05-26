<script setup>
import { reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import CommentIcon from "@/assets/logos/comment_icon.svg?inline";
import RepostIcon from "@/assets/logos/repost_icon.svg?inline";
import BookmarkIcon from "@/assets/logos/bookmark_icon.svg?inline";
import VoteIcon from "@/assets/logos/vote_icon.svg?inline";
import LikesPopup from "@/components/LikesPopup/LikesPopup.vue";

const store = useStore();

// props
const props = defineProps([
  "articleId",
  "articleCounters",
  "articleLikes",
  "type",
]);

// state
const state = reactive({
  likesPopupIsFocused: false,
  likesPopupIsOpen: false,
  animationType: null,
});

// computed
const commentsCount = computed(() => props.articleCounters.comments);
const repostsCount = computed(() => props.articleCounters.reposts);
const favoritesCount = computed(() => props.articleCounters.favorites);
const isLiked = computed(() => props.articleLikes.isLiked);
const likesSumm = computed(() => props.articleLikes.summ);
const likesList = computed(() => props.articleLikes.likesList);
const newLikes = computed(() => props.articleLikes.newLikes);

const voteLikeButtonClassObj = computed(() => ({
  "vote-like_pressed": isLiked.value === 1,
}));

const voteDislikeButtonClassObj = computed(() => ({
  "vote-dislike_pressed": isLiked.value === -1,
}));

const ratingValueStyleObj = computed(() => ({
  "rating-value_negative": likesSumm.value < 0,
  "rating-value_neutral": likesSumm.value === 0,
  "rating-value_positive": likesSumm.value > 0,
}));

const ratingFormatted = computed(() => {
  if (likesSumm.value < 0) {
    return likesSumm.toString().replace(/\-/g, "—");
  } else {
    return likesSumm;
  }
});

// watch
watch(
  () => likesSumm.value,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      state.animationType = "up";
    } else {
      state.animationType = "down";
    }
  }
);

// methods
const getLikes = () => {
  state.likesPopupIsFocused = true;

  if (Object.keys(likesList.value).length > 0 && !newLikes.value) {
    state.likesPopupIsOpen = true;
  } else if (
    likesList.value.length === 0 ||
    (Object.keys(likesList.value).length > 0 && newLikes.value)
  ) {
    store
      .dispatch("requestLikesList", {
        id: props.articleId,
        type: "entry",
        subtype: props.type,
      })
      .then(() => {
        if (
          state.likesPopupIsFocused &&
          Object.keys(likesList.value).length > 0
        ) {
          state.likesPopupIsOpen = true;
        }
      });
  }
};

const closeLikesPopup = () => {
  state.likesPopupIsFocused = false;
  state.likesPopupIsOpen = false;
};

const like = (actionType) => {
  if (actionType === "like") {
    store.dispatch("postEntryLike", {
      id: props.articleId,
      type: "content",
      sign: isLiked.value === 1 ? 0 : -1 ? 1 : 1,
    });
  } else if (actionType === "dislike") {
    store.dispatch("postEntryLike", {
      id: props.articleId,
      type: "content",
      sign: isLiked.value === -1 ? 0 : 1 ? -1 : -1,
    });
  }
};
</script>

<template>
  <div class="article-component__footer">
    <router-link
      class="comments-btn article-component__footer-item"
      :to="{ path: '/' + props.articleId, query: { comments: null } }"
    >
      <CommentIcon class="icon" />
      <span
        class="label"
        v-if="commentsCount > 0"
        v-text="commentsCount"
      ></span>
      <span class="label" v-if="commentsCount === 0">Обсудить</span>
    </router-link>

    <div class="repost-btn article-component__footer-item">
      <RepostIcon class="icon" />
      <span class="label" v-if="repostsCount > 0" v-text="repostsCount"></span>
    </div>

    <div class="favorite-btn article-component__footer-item">
      <BookmarkIcon class="icon" />
      <span
        class="label"
        v-if="favoritesCount > 0"
        v-text="favoritesCount"
      ></span>
    </div>

    <div class="spacer" />

    <div class="rating">
      <div
        class="vote-btn vote-dislike"
        :class="voteDislikeButtonClassObj"
        @click="like('dislike')"
      >
        <VoteIcon class="icon" />
      </div>
      <div
        class="rating-wrapp"
        @mouseenter="getLikes"
        @mouseleave="closeLikesPopup"
        @touchstart="getLikes"
        v-outside-click:[true]="closeLikesPopup"
      >
        <transition-group
          class="rating-value"
          :class="ratingValueStyleObj"
          :name="
            state.animationType === 'up'
              ? 'rating-value_up'
              : 'rating-value_down'
          "
          tag="div"
        >
          <div
            v-text="ratingFormatted.value"
            :key="ratingFormatted.value"
          ></div>
        </transition-group>
        <transition name="entry-likes-popup">
          <div class="entry-likes-popup" v-if="state.likesPopupIsOpen">
            <LikesPopup :likes="likesList" type="entry" />
          </div>
        </transition>
      </div>
      <div
        class="vote-btn vote-like"
        :class="voteLikeButtonClassObj"
        @click="like('like')"
      >
        <VoteIcon class="icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.article-component__footer {
  display: flex;
  align-items: center;
  font-size: 15px;

  & .comments-btn,
  .repost-btn,
  .favorite-btn {
    & .icon {
      width: 22px;
      height: 22px;
      color: inherit;
      stroke-width: 2.25;
    }

    & .label {
      margin-left: 7px;
      color: inherit;
      font-weight: 500;
    }
  }

  & .comments-btn,
  .repost-btn,
  .favorite-btn,
  .vote-btn {
    color: var(--grey-color);
    cursor: pointer;
  }

  & .rating {
    display: flex;
    align-items: center;

    & .vote-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      & .icon {
        width: 22px;
        height: 22px;
      }

      &.vote-dislike {
        margin-right: 4px;
        transform: rotate(180deg);

        &_pressed {
          background: rgba(211, 79, 87, 0.1) !important;
          color: var(--red-color);
        }
      }

      &.vote-like {
        margin-left: 4px;

        &_pressed {
          background: rgba(79, 167, 87, 0.1) !important;
          color: var(--green-color);
        }
      }
    }

    & .rating-wrapp {
      position: relative;
      display: flex;
      justify-content: center;
      cursor: default;

      & .rating-value {
        padding: 0 4px;
        font-weight: 500;

        &_negative {
          color: var(--red-color);
        }

        &_neutral {
          color: var(--grey-color);
        }

        &_positive {
          color: var(--green-color);
        }

        &_up {
          &-enter-active {
            animation: rating-anim-up-enter 0.2s;
          }

          &-leave-active {
            position: absolute;
            animation: rating-anim-up-leave 0.2s;
          }
        }

        &_down {
          &-enter-active {
            animation: rating-anim-down-enter 0.2s;
          }

          &-leave-active {
            position: absolute;
            animation: rating-anim-down-leave 0.2s;
          }
        }
      }

      & .entry-likes-popup {
        position: absolute;
        top: 100%;
        margin-top: 13px;
        font-size: 16px;
        z-index: 3;

        &-enter-active,
        &-leave-active {
          transition: opacity 0.1s;
        }

        &-enter-from,
        &-leave-to {
          opacity: 0;
        }
      }
    }
  }

  &-item {
    display: flex;
    align-items: center;
    line-height: 22px;

    &:not(:last-child) {
      margin-right: 25px;
    }
  }
}

@media (hover: hover) {
  .article-component__footer {
    .comments-btn,
    .repost-btn,
    .favorite-btn {
      &:hover {
        color: var(--blue-color);
      }
    }

    & .rating {
      & .vote-btn:hover {
        background: var(--rating-button-hover);
      }

      & .vote-btn {
        &.vote-like_pressed {
          &:hover {
            background: #4fa75733 !important;
          }
        }

        &.vote-dislike_pressed {
          &:hover {
            background: #d34f5733 !important;
          }
        }
      }

      & .rating-wrapp {
        &:hover {
          &::before {
            content: "";
            position: absolute;
            top: 0;
            width: 30px;
            height: 35px;
          }
        }
      }
    }
  }
}

@media (max-width: 1080px) {
  .article-component__footer {
    & .rating {
      & .rating-wrapp {
        justify-content: flex-end;
      }

      & .likes-popup {
        transform: translateX(35px);
      }
    }
  }
}
</style>