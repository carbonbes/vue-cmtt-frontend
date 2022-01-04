<template>
  <div class="entry-footer e-island">
    <div class="entry-footer__comments-btn entry-footer__item">
      <message-circle-icon class="icon" />
      <span class="label" v-if="commentsCount > 0">{{ commentsCount }}</span>
      <span class="label" v-if="commentsCount === 0">Обсудить</span>
    </div>
    <div class="entry-footer__repost-btn entry-footer__item">
      <refresh-cw-icon class="icon" />
      <span class="label" v-if="repostsCount > 0">{{ repostsCount }}</span>
    </div>
    <div class="entry-footer__favorite-btn entry-footer__item">
      <bookmark-icon class="icon" />
      <span class="label" v-if="favoritesCount > 0">{{ favoritesCount }}</span>
    </div>
    <div class="spacer" />
    <div class="entry-footer__rating">
      <div class="entry-footer__vote-btn vote-dislike">
        <chevron-down-icon class="icon" />
      </div>
      <div class="entry-footer__rating-value" :class="ratingValueStyles">
        <template v-if="entryRating.summ < 0">–</template
        >{{ entryRating.counter }}
      </div>
      <div class="entry-footer__vote-btn vote-like">
        <chevron-up-icon class="icon" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  MessageCircleIcon,
  RefreshCwIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@zhuowenli/vue-feather-icons";

export default {
  components: {
    MessageCircleIcon,
    RefreshCwIcon,
    BookmarkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
  },

  computed: {
    ratingValueStyles: function () {
      return {
        "entry-footer__rating-value_negative": this.entryRating.summ < 0,
        "entry-footer__rating-value_neutral": this.entryRating.summ === 0,
        "entry-footer__rating-value_positive": this.entryRating.summ > 0,
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

<style>
.entry-footer {
  display: flex;
  align-items: center;
}

.entry-footer__item {
  display: flex;
  align-items: center;
}

.entry-footer__item:not(:last-child) {
  margin-right: 33px;
}

.entry-footer__comments-btn .icon,
.entry-footer__repost-btn .icon,
.entry-footer__favorite-btn .icon {
  width: 21px;
  height: 21px;
  color: inherit;
  stroke-width: 2.25;
}

.entry-footer__comments-btn .label,
.entry-footer__repost-btn .label,
.entry-footer__favorite-btn .label {
  margin-left: 5px;
  color: inherit;
  font-weight: 500;
}

.entry-footer__comments-btn,
.entry-footer__repost-btn,
.entry-footer__favorite-btn,
.entry-footer__vote-btn {
  color: var(--grey-color);
  cursor: pointer;
}

.entry-footer__comments-btn .icon {
  transform: scale(-1, 1);
}

.entry-footer__rating {
  display: flex;
  align-items: center;
}

.entry-footer__vote-btn {
  display: flex;
}

.entry-footer__vote-btn .icon {
  width: 28px;
  height: 28px;
  color: inherit;
}

.entry-footer__vote-btn.vote-dislike {
  margin-right: 5px;
}

.entry-footer__vote-btn.vote-like {
  margin-left: 5px;
}

.entry-footer__rating-value {
  padding: 0 4px;
  font-weight: 500;
}

.entry-footer__rating-value_negative {
  color: var(--red-color);
}

.entry-footer__rating-value_neutral {
  color: var(--grey-color);
}

.entry-footer__rating-value_positive {
  color: var(--green-color);
}

@media (hover: hover) {
  .entry-footer__comments-btn:hover,
  .entry-footer__repost-btn:hover,
  .entry-footer__favorite-btn:hover {
    color: var(--blue-color);
  }

  .entry-footer__vote-btn:hover {
    border-radius: 50%;
    background: #0000000d;
  }
}

@media screen and (max-width: 768px) {
  .entry-footer__item:not(:last-child) {
    margin-right: 20px;
  }
}
</style>