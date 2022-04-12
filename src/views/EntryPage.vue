<template>
  <div class="entry-page-wrapp">
    <div class="entry-page">
      <div class="entry-page__header ep-island">
        <entry-header
          :subsiteData="entry.subsite"
          :subsiteType="entry.subsite.type"
          :subsiteId="entry.subsite.id"
          :subsiteAvatar="entry.subsite.avatar.data.uuid"
          :subsiteName="entry.subsite.name"
          :authorData="entry.author"
          :authorType="entry.author.type"
          :authorId="entry.author.id"
          :authorName="entry.author.name"
          :date="entry.date"
          dateType="0"
        />
      </div>
      <div class="entry-page__content">
        <div class="entry-page__title ep-island" v-if="entry.title">
          <entry-title :title="entry.title" :isEditorial="entry.isEditorial" />
        </div>
        <template v-for="(block, index) in entry.blocks" :key="index">
          <image-block
            :item="block"
            v-if="
              block.type === 'media' &&
              (block.data.items[0].image.data.type === 'jpg' ||
                block.data.items[0].image.data.type === 'png' ||
                block.data.items[0].image.data.type === 'webp')
            "
          />

          <video-block
            :item="block"
            type="default"
            v-if="
              block.type === 'media' &&
              block.data.items[0].image.data.type === 'gif'
            "
          />

          <video-block
            :item="block"
            type="video"
            v-if="block.type === 'video'"
          />

          <text-block :item="block" v-if="block.type === 'text'" />

          <link-block
            :title="block.data.link.data.title"
            :description="block.data.link.data.description"
            :urlSrc="block.data.link.data.url"
            :sourceIcon="block.data.link.data.image?.data.uuid"
            v-if="block.type === 'link'"
          />

          <quote-block
            :avatarSrc="block.data.image?.data.uuid"
            :text="block.data.text"
            :authorSrc="block.data.subline1"
            :bio="block.data.subline2"
            :textSizeSrc="block.data.text_size"
            v-if="block.type === 'quote'"
          />

          <person-block
            :avatar="block.data.image?.data.uuid"
            :name="block.data.title"
            :description="block.data.description"
            v-if="block.type === 'person'"
          />

          <telegram-component
            class="entry-page__embed"
            :authorAvatarSrc="
              block.data.telegram.data.tg_data.author.avatar_url
            "
            :authorName="block.data.telegram.data.tg_data.author.name"
            :dateTime="block.data.telegram.data.tg_data.datetime"
            :text="block.data.telegram.data.tg_data.text"
            :imgCover="block.data.telegram.data.tg_data.photos[0]?.leonardo_url"
            :videoCover="block.data.telegram.data.tg_data.videos[0]"
            v-if="block.type === 'telegram'"
          />

          <twitter-component
            class="entry-page__embed"
            :authorAvatar="
              block.data.tweet.data.tweet_data.user.profile_image_url_https
            "
            :authorName="block.data.tweet.data.tweet_data.user.name"
            :authorTag="block.data.tweet.data.tweet_data.user.screen_name"
            :dateTime="block.data.tweet.data.tweet_data.created_at"
            :text="
              block.data.tweet.data.tweet_data.processed_text ||
              block.data.tweet.data.tweet_data.full_text
            "
            :media="block.data.tweet.data.tweet_data.extended_entities?.media"
            v-if="block.type === 'tweet'"
          />
        </template>
      </div>
      <div class="entry-page__footer ep-island">
        <entry-footer
          :commentsCount="commentsList.length"
          :repostsCount="entry.counters.reposts"
          :favoritesCount="entry.counters.favorites"
          :entryRating="entry.likes"
          :entryId="entryId"
        />
      </div>
    </div>

    <div class="entry-page__comments">
      <div class="entry-page__comments-header">
        <div class="comments-count">
          {{ commentsList.length }} {{ commentsWordDecl }}
        </div>
      </div>
      <div class="entry-page__comments-reply-form">
        <reply-form
          type="root"
          :closeReplyForm="this.closeReplyForm"
          v-if="replyTopFormVisible"
        />
        <div
          class="entry-page__comments-pseudo-reply-form"
          @click="openTopReplyForm"
          v-if="!replyTopFormVisible"
        >
          Написать комментарий...
        </div>
      </div>
      <div class="entry-page__comments-content">
        <comments-block :comments="this.commentsTree" />
      </div>
      <div
        class="entry-page__comments-reply-form bottom"
        v-if="commentsList.length > 10"
      >
        <reply-form
          type="root"
          :closeReplyForm="this.closeReplyForm"
          v-if="replyBottomFormVisible"
        />
        <div
          class="entry-page__comments-pseudo-reply-form"
          @click="openBottomReplyForm"
          v-if="!replyBottomFormVisible"
        >
          Написать комментарий...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import EntryHeader from "@/components/Entry/EntryHeader.vue";
import EntryTitle from "@/components/Entry/EntryTitle.vue";
import EntryFooter from "@/components/Entry/EntryFooter.vue";
import ImageBlock from "@/components/EntryPage/ImageBlock.vue";
import VideoBlock from "@/components/EntryPage/VideoBlock.vue";
import TextBlock from "@/components/EntryPage/TextBlock.vue";
import LinkBlock from "@/components/EntryPage/LinkBlock.vue";
import QuoteBlock from "@/components/EntryPage/QuoteBlock.vue";
import PersonBlock from "@/components/EntryPage/PersonBlock.vue";
import TwitterComponent from "@/components/TwitterComponent.vue";
import TelegramComponent from "@/components/TelegramComponent.vue";
import CommentsBlock from "@/components/EntryPage/CommentsComponents/CommentsBlock.vue";
import ReplyForm from "@/components/EntryPage/CommentsComponents/ReplyForm.vue";
import store from "@/store";
import nProgress from "nprogress";
import { notify } from "@kyvg/vue3-notification";
import declensionWords from "@/utils/declensionWords";

function requestEntry(routeTo, next) {
  nProgress.start();

  Promise.all([
    store.dispatch("requestEntry", routeTo.params.id),
    store.dispatch("requestCommentsList", { contentId: routeTo.params.id }),
  ])
    .then(() => {
      nProgress.done();
      next();
    })
    .catch((error) => {
      nProgress.done();
      next(false);
      notify({
        title: "Ошибка " + error.response.data.error.code,
        type: "error",
        text: error.response.data.message,
      });
    });
}

export default {
  components: {
    EntryHeader,
    EntryTitle,
    EntryFooter,
    ImageBlock,
    VideoBlock,
    TextBlock,
    LinkBlock,
    QuoteBlock,
    PersonBlock,
    TwitterComponent,
    TelegramComponent,
    CommentsBlock,
    ReplyForm,
  },

  data() {
    return {
      commentWords: ["комментарий", "комментария", "комментариев"],
      replyTopFormVisible: false,
      replyBottomFormVisible: false,
    };
  },

  computed: {
    entryId() {
      return this.entry.id;
    },

    commentsTree() {
      return this.flatCommentsToTree(this.commentsList);
    },

    commentsWordDecl() {
      return declensionWords(this.commentsList.length, this.commentWords);
    },

    ...mapGetters(["entry", "commentsList"]),
  },

  methods: {
    flatCommentsToTree(comments) {
      var map = {},
        node,
        roots = [],
        i;

      for (i = 0; i < comments.length; i += 1) {
        map[comments[i].id] = i;
        comments[i].replies = [];
      }

      for (i = 0; i < comments.length; i += 1) {
        node = comments[i];
        if (node.replyTo !== 0) {
          if (comments[map[node.replyTo]]) {
            comments[map[node.replyTo]].replies.push(node);
          } else return;
        } else {
          roots.push(node);
        }
      }
      return roots;
    },

    openTopReplyForm() {
      this.replyTopFormVisible = true;
      this.replyBottomFormVisible = false;
    },

    closeTopReplyForm() {
      this.replyTopFormVisible = false;
    },

    openBottomReplyForm() {
      this.replyBottomFormVisible = true;
      this.replyTopFormVisible = false;
    },

    closeBottomReplyForm() {
      this.replyBottomFormVisible = false;
    },

    ...mapMutations(["setEntryPrevLiked"]),
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    requestEntry(routeTo, next);
  },

  beforeRouteUpdate(routeTo, routeFrom, next) {
    if (routeTo.params.id !== routeFrom.params.id) {
      requestEntry(routeTo, next);
    } else next();
  },

  created() {
    document.title = this.entry.title;
  },

  mounted() {
    this.setEntryPrevLiked(this.entry.likes.isLiked);
  },

  unmounted() {
    store.commit("clearEntry");
  },
};
</script>

<style lang="scss">
.entry-page-wrapp {
  margin: 0 auto;
  max-width: 1020px;
}

.entry-page {
  color: var(--black-color);
  background: var(--entry-bg-color);
  border-radius: 0 0 8px 8px;
}

.entry-page__header {
  padding-top: 30px;
  padding-bottom: 15px;
}

.entry-page__title {
  & .entry-title {
    font-size: 22px;
    font-weight: 500;
    line-height: 30px;

    &__editorial-icon {
      & .icon {
        margin-left: 4px;
      }
    }
  }

  & + .entry-page__img-block {
    margin-top: 15px;
  }

  & + .entry-page__video-block {
    margin-top: 15px;
  }

  & + .entry-page__embed {
    margin-top: 12px !important;
  }
}

.entry-page__content {
  font-size: 17px;
  line-height: 1.6em;
  word-break: break-word;
}

.entry-page__link-block {
  margin-top: 15px;
  margin-bottom: 15px;
}

.entry-page__footer {
  padding: 15px 0;
}

.entry-page__embed {
  margin-left: auto;
  margin-right: auto;
  max-width: 640px;

  &:not(:first-child) {
    margin-top: 30px;
    margin-bottom: 30px;
  }

  &:last-child {
    margin-bottom: 15px;
  }

  & + .entry-page__video-block {
    margin-top: 12px;
  }
}

.entry-page__comments {
  margin: 30px 0;
  color: var(--black-color);
  background: var(--entry-bg-color);
  border-radius: 8px;

  &-header {
    margin-left: auto;
    margin-right: auto;
    padding-top: 30px;
    padding-bottom: 15px;
    max-width: 640px;

    & .comments-count {
      font-size: 20px;
      line-height: 1.4em;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &-content {
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 30px;
    max-width: 640px;

    & > .entry-page__comment:not(:first-child) {
      margin-top: 25px;
    }
  }

  &-pseudo-reply-form {
    padding: 0 17px;
    height: 48px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    color: var(--grey-color);
    background-color: var(--form-bg-color);
    border: 1px solid var(--form-border-color);
    cursor: pointer;
  }

  &-reply-form {
    margin-left: auto;
    margin-right: auto;
    padding-top: 15px;
    padding-bottom: 30px;
    max-width: 640px;

    &.bottom {
      padding-top: 0;
      padding-bottom: 30px;
    }
  }
}

.reply-form {
  position: relative;
  padding: 12px;
  flex-basis: 100%;
  max-width: 100%;
  border-radius: 10px;
  color: var(--black-color);
  background-color: var(--form-bg-color);
  border: 1px solid var(--form-border-color);
  transition: background-color 0.15s, border 0.15s, box-shadow 0.15s;
  order: 2;
  z-index: 1;

  &:hover {
    background-color: transparent;
    border: 1px solid var(--form-border-color-hover);
    box-shadow: var(--form-shadow);
  }

  &_focused {
    background-color: transparent;
    border: 1px solid var(--form-border-color-active) !important;
    box-shadow: var(--form-shadow);
    transition: border 0.2s;
  }

  &_sending {
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
  }

  &__text-field {
    position: relative;
    margin: 0;
    padding-top: 0;
    padding-bottom: 40px;
    width: 100%;
    display: inline-block;
    outline: none;

    &_writes-0 {
      &::after {
        content: "Написать комментарий...";
      }
    }

    &_writes-1 {
      &::after {
        content: "Написать ответ...";
      }
    }

    &_writes-0,
    &_writes-1 {
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        color: var(--grey-color);
        cursor: text;
      }
    }
  }

  &__actions {
    margin-top: 12px;
    display: flex;

    & .reply-actions {
      margin-left: auto;
      display: flex;
      align-items: center;

      & .cancel-btn {
        margin-right: 15px;
        color: var(--grey-color);
        cursor: pointer;
      }

      & .button {
        width: 100px;
        height: 40px;
        display: flex;
        align-items: center;
      }
    }
  }
}

.ep-island {
  margin-left: auto;
  margin-right: auto;
  max-width: 640px;
}

@media screen and (max-width: 768px) {
  .entry-page {
    border-radius: 0;

    &__header {
      padding-top: 15px;
    }

    &__comments {
      padding-left: 15px;
      padding-right: 15px;
      border-radius: 0;
    }
  }

  .entry-page__comments {
    margin-bottom: 0;
  }

  .entry-page__comments-content {
    padding-bottom: 15px;
  }

  .entry-page__embed {
    margin-left: 15px;
    margin-right: 15px;

    &:not(:first-child) {
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }

  .ep-island {
    margin-left: 15px;
    margin-right: 15px;
  }
}
</style>