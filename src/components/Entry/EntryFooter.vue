<template>
  <div class="entry-footer">
    <div class="entry-footer__comments-btn entry-footer__item">
      <comment-icon class="icon" />
      <span class="label" v-if="commentsCount > 0">{{ commentsCount }}</span>
      <span class="label" v-if="commentsCount === 0">Обсудить</span>
    </div>
    <div class="entry-footer__repost-btn entry-footer__item">
      <repost-icon class="icon" />
      <span class="label" v-if="repostsCount > 0">{{ repostsCount }}</span>
    </div>
    <div class="entry-footer__favorite-btn entry-footer__item">
      <bookmark-icon class="icon" />
      <span class="label" v-if="favoritesCount > 0">{{ favoritesCount }}</span>
    </div>
    <div class="spacer" />
    <div class="entry-footer__rating">
      <div
        class="entry-footer__vote-btn vote-dislike"
        :class="voteDislikeButtonClassObject"
        @click="like('dislike')"
      >
        <vote-icon class="icon" />
      </div>
      <div
        class="entry-footer__rating-wrapp"
        @mouseenter="getLikes"
        @mouseleave="closeLikesPopup"
        @touchstart="getLikes"
        v-on-click-outside="this.closeLikesPopup"
      >
        <transition-group
          class="entry-footer__rating-value"
          :class="ratingValueStyles"
          :name="
            this.animationType === 'up'
              ? 'entry-footer__rating-value_up'
              : 'entry-footer__rating-value_down'
          "
          tag="div"
        >
          <div v-text="ratingFormatted" :key="ratingFormatted"></div>
        </transition-group>
        <transition name="entry-footer__likes-popup"
          ><div class="entry-footer__likes-popup" v-if="likesPopupIsOpen">
            <likes-popup :likes="this.likesList" type="entry" /></div
        ></transition>
      </div>
      <div
        class="entry-footer__vote-btn vote-like"
        :class="voteLikeButtonClassObject"
        @click="like('like')"
      >
        <vote-icon class="icon" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import LikesPopup from "@/components/LikesPopup.vue";
import CommentIcon from "@/assets/logos/comment_icon.svg?inline";
import RepostIcon from "@/assets/logos/repost_icon.svg?inline";
import BookmarkIcon from "@/assets/logos/bookmark_icon.svg?inline";
import VoteIcon from "@/assets/logos/vote_icon.svg?inline";

export default {
  components: {
    LikesPopup,
    CommentIcon,
    RepostIcon,
    BookmarkIcon,
    VoteIcon,
  },

  props: {
    commentsCount: Number,
    repostsCount: Number,
    favoritesCount: Number,
    entryRating: Object,
    entryId: Number,
  },

  data() {
    return {
      likesPopupIsFocused: false,
      likesPopupIsOpen: false,
      animationType: null,
    };
  },

  computed: {
    ratingValueStyles() {
      return {
        "entry-footer__rating-value_negative": this.entryRating.summ < 0,
        "entry-footer__rating-value_neutral": this.entryRating.summ === 0,
        "entry-footer__rating-value_positive": this.entryRating.summ > 0,
      };
    },

    voteLikeButtonClassObject() {
      return {
        "vote-like_active": this.isLiked === 1,
      };
    },

    voteDislikeButtonClassObject() {
      return {
        "vote-dislike_active": this.isLiked === -1,
      };
    },

    rating() {
      return this.entryRating.summ;
    },

    isLiked() {
      return this.entryRating.isLiked;
    },

    ratingFormatted() {
      if (this.entryRating.summ < 0) {
        return this.entryRating.summ.toString().replace(/\-/g, "—");
      } else {
        return this.entryRating.summ;
      }
    },

    ...mapGetters(["likesList"]),
  },

  methods: {
    getLikes() {
      this.likesPopupIsFocused = true;

      this.requestLikesList({ id: this.entryId, type: "entry" }).then(() => {
        if (
          this.likesPopupIsFocused &&
          Object.keys(this.likesList).length !== 0
        ) {
          this.likesPopupIsOpen = true;
        }
      });
    },

    closeLikesPopup() {
      this.likesPopupIsFocused = false;
      this.likesPopupIsOpen = false;
    },

    like(actionType) {
      if (actionType === "like") {
        this.postEntryLike({
          id: this.entryId,
          type: "content",
          sign: this.isLiked === 1 ? 0 : -1 ? 1 : 1,
        });
      } else if (actionType === "dislike") {
        this.postEntryLike({
          id: this.entryId,
          type: "content",
          sign: this.isLiked === -1 ? 0 : 1 ? -1 : -1,
        });
      }
    },

    ...mapActions(["requestLikesList", "postEntryLike"]),
  },

  watch: {
    rating(newValue, oldValue) {
      if (newValue > oldValue) {
        this.animationType = "up";
      } else {
        this.animationType = "down";
      }
    },
  },
};
</script>

<style lang="scss">
.entry-footer {
  display: flex;
  align-items: center;
}

.entry-footer__item {
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-right: 33px;
  }
}

.entry-footer__comments-btn,
.entry-footer__repost-btn,
.entry-footer__favorite-btn {
  & .icon {
    color: inherit;
    stroke-width: 2.25;
  }

  & .label {
    margin-left: 5px;
    color: inherit;
    font-weight: 500;
  }
}

.entry-footer__comments-btn,
.entry-footer__repost-btn,
.entry-footer__favorite-btn,
.entry-footer__vote-btn {
  color: var(--grey-color);
  cursor: pointer;
}

.entry-footer__rating {
  display: flex;
  align-items: center;
}

.entry-footer__vote-btn {
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

    &_active {
      background: rgba(211, 79, 87, 0.1) !important;
      color: var(--red-color);
    }
  }

  &.vote-like {
    margin-left: 4px;

    &_active {
      background: rgba(79, 167, 87, 0.1) !important;
      color: var(--green-color);
    }
  }
}

.entry-footer__rating-wrapp {
  position: relative;
  display: flex;
  justify-content: center;
}

.entry-footer__rating-value {
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

.entry-footer__likes-popup {
  position: absolute;
  top: 100%;
  margin-top: 13px;
  z-index: 2;

  &-enter-active,
  &-leave-active {
    transition: opacity 0.1s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

@media (hover: hover) {
  .entry-footer__comments-btn,
  .entry-footer__repost-btn,
  .entry-footer__favorite-btn {
    &:hover {
      color: var(--blue-color);
    }
  }

  .entry-footer__vote-btn:hover {
    background: var(--rating-button-hover);
  }

  .entry-footer__vote-btn {
    &.vote-like_active {
      &:hover {
        background: #4fa75733 !important;
      }
    }

    &.vote-dislike_active {
      &:hover {
        background: #d34f5733 !important;
      }
    }
  }

  .entry-footer__rating-wrapp {
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

@media screen and (max-width: 768px) {
  .entry-footer__item:not(:last-child) {
    margin-right: 20px;
  }

  .entry-footer__rating-wrapp {
    justify-content: flex-end;
  }

  .entry-footer__likes-popup {
    transform: translateX(35px);
  }
}
</style>