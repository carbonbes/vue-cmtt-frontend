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
      >
        <vote-icon class="icon" />
      </div>
      <div class="entry-footer__rating-value" :class="ratingValueStyles">
        <template v-if="entryRating.summ < 0">–</template
        >{{ entryRating.counter }}
      </div>
      <div
        class="entry-footer__vote-btn vote-like"
        :class="voteLikeButtonClassObject"
      >
        <vote-icon class="icon" />
      </div>
    </div>
  </div>
</template>

<script>
import CommentIcon from "@/assets/logos/comment_icon.svg?inline";
import RepostIcon from "@/assets/logos/repost_icon.svg?inline";
import BookmarkIcon from "@/assets/logos/bookmark_icon.svg?inline";
import VoteIcon from "@/assets/logos/vote_icon.svg?inline";

export default {
  components: {
    CommentIcon,
    RepostIcon,
    BookmarkIcon,
    VoteIcon,
  },

  props: {
    actions: Object,
  },

  computed: {
    ratingValueStyles: function () {
      return {
        "entry-footer__rating-value_negative": this.entryRating.summ < 0,
        "entry-footer__rating-value_neutral": this.entryRating.summ === 0,
        "entry-footer__rating-value_positive": this.entryRating.summ > 0,
      };
    },

    voteLikeButtonClassObject() {
      return {
        "vote-like_active": this.entryRating.isLiked === 1,
      };
    },

    voteDislikeButtonClassObject() {
      return {
        "vote-dislike_active": this.entryRating.isLiked === -1,
      };
    },
  },

  props: {
    commentsCount: Number,
    repostsCount: Number,
    favoritesCount: Number,
    entryRating: Object,
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
    width: 20px;
    height: 20px;
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
}

@media screen and (max-width: 768px) {
  .entry-footer__item:not(:last-child) {
    margin-right: 20px;
  }
}
</style>