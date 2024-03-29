<template>
  <div class="entry-page-wrapp">
    <div class="entry-page">
      <div class="entry-page__header ep-island">
        <ArticleHeader :article="entry" dateType="1" />
      </div>
      <div class="entry-page__content">
        <div class="entry-page__title ep-island" v-if="entry.title">
          <ArticleTitle :title="entry.title" :isEditorial="entry.isEditorial" />
        </div>
        <template v-for="(block, index) in entry.blocks" :key="index">
          <image-block
            :item="block"
            v-if="
              block.type === 'media' &&
              block.data.items.length === 1 &&
              (block.data.items[0].image.data.type === 'jpg' ||
                block.data.items[0].image.data.type === 'png' ||
                block.data.items[0].image.data.type === 'webp')
            "
          />

          <gallery-block
            :images="block.data.items"
            type="entry_page"
            v-if="
              block.type === 'media' &&
              block.data.items.length > 1 &&
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

          <LinkBlock
            :title="block.data.link.data.title"
            :description="block.data.link.data.description"
            :urlSrc="block.data.link.data.url"
            :sourceIcon="block.data.link.data.image?.data.uuid"
            :availability="true"
            v-if="block.data.link && block.type === 'link'"
          />

          <LinkBlock
            :availability="false"
            v-if="!block.data.link && block.type === 'link'"
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

          <telegram-block
            class="ep-island"
            :data="block.data"
            v-if="block.type === 'telegram'"
          />

          <twitter-block
            class="ep-island"
            :data="block.data"
            v-if="block.type === 'tweet'"
          />

          <ListBlock :items="block.data.items" v-if="block.type === 'list'" />
        </template>
      </div>
      <div class="entry-page__footer ep-island">
        <ArticleFooter
          :articleId="entry.id"
          :articleCounters="entry.counters"
          :articleLikes="entry.likes"
          type="pageArticle"
        />
      </div>
    </div>

    <div class="entry-page__comments" id="entry-page__comments">
      <div class="entry-page__comments-header">
        <div class="comments-count">
          {{ commentsList.length }} {{ commentsWordDecl }}
        </div>
        <div class="entry-page__comments-reply-form">
          <reply-form
            type="root"
            :closeReplyForm="this.closeTopReplyForm"
            position="top"
            v-if="replyTopFormVisible"
          />
          <div
            class="pseudo-reply-form"
            @click="openTopReplyForm"
            v-if="!replyTopFormVisible"
          >
            Написать комментарий...
          </div>
        </div>
      </div>
      <div class="entry-page__comments-content">
        <comments-block :comments="this.commentsTree" />
      </div>
      <div class="entry-page__comments-footer">
        <div
          class="entry-page__comments-reply-form bottom"
          v-if="commentsList.length >= 10"
        >
          <reply-form
            type="root"
            :closeReplyForm="this.closeBottomReplyForm"
            position="bottom"
            v-if="replyBottomFormVisible"
          />
          <div
            class="pseudo-reply-form"
            @click="openBottomReplyForm"
            :closeReplyForm="this.closeBottomReplyForm"
            v-if="!replyBottomFormVisible"
          >
            Написать комментарий...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ArticleHeader from "../components/Article/ArticleHeader.vue";
import ArticleTitle from "../components/Article/ArticleTitle.vue";
import ArticleFooter from "../components/Article/ArticleFooter.vue";
import ImageBlock from "@/components/EntryPage/ArticleSector/ImageBlock.vue";
import VideoBlock from "@/components/EntryPage/ArticleSector/VideoBlock.vue";
import GalleryBlock from "@/components/EntryPage/ArticleSector/GalleryBlock.vue";
import TextBlock from "@/components/EntryPage/ArticleSector/TextBlock.vue";
import LinkBlock from "@/components/EntryPage/ArticleSector/LinkBlock.vue";
import QuoteBlock from "@/components/EntryPage/ArticleSector/QuoteBlock.vue";
import PersonBlock from "@/components/EntryPage/ArticleSector/PersonBlock.vue";
import TwitterBlock from "@/components/EntryPage/ArticleSector/TwitterBlock.vue";
import TelegramBlock from "@/components/EntryPage/ArticleSector/TelegramBlock.vue";
import CommentsBlock from "@/components/EntryPage/CommentsSector/CommentsBlock.vue";
import ListBlock from "@/components/EntryPage/ArticleSector/ListBlock.vue";
import ReplyForm from "@/components/EntryPage/ReplyForm.vue";
import store from "@/store";
import nProgress from "nprogress";
import { notify } from "@kyvg/vue3-notification";
import wordDeclension from "@/utils/wordDeclension";

function requestEntry(routeTo, next) {
  nProgress.start();

  return Promise.all([
    store.dispatch("requestEntry", routeTo.params.id),
    store.dispatch("requestCommentsList", {
      params: { contentId: routeTo.params.id },
    }),
  ])
    .then(() => {
      nProgress.done();
      store.commit("closeStartScreen");
      next();
    })
    .catch((error) => {
      nProgress.done();
      store.commit("closeStartScreen");
      next(false);
      notify({
        type: "error",
        title: "Ошибка " + error.response.data.error.code,
        text: error.response.data.message,
      });
    });
}

export default {
  components: {
    ArticleHeader,
    ArticleTitle,
    ArticleFooter,
    ImageBlock,
    VideoBlock,
    GalleryBlock,
    TextBlock,
    LinkBlock,
    QuoteBlock,
    PersonBlock,
    TwitterBlock,
    TelegramBlock,
    CommentsBlock,
    ListBlock,
    ReplyForm,
  },

  data() {
    return {
      commentWords: ["комментарий", "комментария", "комментариев"],
      replyTopFormVisible: false,
      replyBottomFormVisible: false,
      highlightTimeout: null,
    };
  },

  computed: {
    entryId() {
      return this.entry.id;
    },

    commentsTree() {
      return this.makeCommentsTree(this.commentsList);
    },

    commentsWordDecl() {
      return wordDeclension(this.commentsList.length, this.commentWords);
    },

    ...mapGetters(["entry", "commentsList"]),
  },

  methods: {
    makeCommentsTree(nodes, parentId = 0) {
      return nodes
        .filter((node) => node.replyTo === parentId)
        .reduce(
          (tree, node) => [
            ...tree,
            {
              ...node,
              replies: this.makeCommentsTree(nodes, node.id),
            },
          ],
          []
        );
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

    setLastView(actionType) {
      if (this.entryId) {
        let lastViewed = localStorage.getItem(this.entryId + "-last-viewed");

        if (!lastViewed) {
          localStorage.setItem(this.entryId + "-last-viewed", Date.now());
        } else if (
          lastViewed &&
          (actionType === "leave" ||
            actionType === "routeUpdate" ||
            actionType === "enter")
        ) {
          localStorage.setItem(this.entryId + "-last-viewed", Date.now());
        }
      }
    },

    setPageTitle() {
      if (this.entry.title) {
        document.title = this.entry.title;
      } else if (!this.entry.title) {
        if (this.entry.subsite.subtype === "personal_blog") {
          document.title = "Запись в блоге " + this.entry.author.name;
        } else {
          document.title = "Запись в подсайте " + this.entry.subsite.name;
        }
      }
    },

    ...mapMutations(["setTemporaryHightlightComment"]),
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    requestEntry(routeTo, next).then(() => {
      store.commit("connectEntryPageChannel", routeTo.params.id);
      store.commit("setIdEntryConnectedChannel", routeTo.params.id);

      if (routeTo.query.comment) {
        store.commit("setTemporaryHightlightComment", routeTo.query.comment);
      }
    });
  },

  beforeRouteUpdate(routeTo, routeFrom, next) {
    if (routeTo.query.comment) {
      store.commit("setTemporaryHightlightComment", routeTo.query.comment);
    }

    if (routeTo.params.id !== routeFrom.params.id) {
      store.commit("disconnectEntryPageChannel", routeFrom.params.id);
      store.commit("setIdEntryConnectedChannel", null);
      this.setLastView("routeUpdate");

      requestEntry(routeTo, next).then(() => {
        store.commit("connectEntryPageChannel", routeTo.params.id);
        store.commit("setIdEntryConnectedChannel", routeTo.params.id);
        this.setPageTitle();
      });
    } else next();
  },

  created() {
    this.setLastView("enter");
    this.setPageTitle();
  },

  unmounted() {
    store.commit("disconnectEntryPageChannel", this.entryId);
    store.commit("setIdEntryConnectedChannel", null);
    store.commit("clearEntry");
    this.setLastView("leave");
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
  background: var(--island-bg);
  border-radius: 0 0 8px 8px;
}

.entry-page__header {
  padding-top: 30px;
  padding-bottom: 15px;
}

.entry-page__title {
  margin: 0 auto;
  max-width: 640px;

  .article-title {
    font-size: 22px;
    font-weight: 500;
    line-height: 30px;

    .editorial-icon {
      .icon {
        margin-left: 4px;
      }
    }
  }

  + .entry-page__img-block,
  + .entry-page__video-block,
  + .ep-island {
    margin-top: 15px;
  }
}

.entry-page__content {
  font-size: 17px;
  line-height: 1.6em;
  word-break: break-word;
}

.entry-page__footer {
  padding: 15px 0;
}

.entry-page__embed {
  &:not(:first-child) {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  + .entry-page__video-block {
    margin-top: 12px;
  }
}

.entry-page__comments {
  --header-pt: 30px;
  --header-pb: 15px;
  --header-label-fs: 20px;

  margin: 30px 0;
  color: var(--black-color);
  background: var(--island-bg);
  border-radius: 8px;

  &-header {
    margin-left: auto;
    margin-right: auto;
    padding-top: var(--header-pt);
    padding-bottom: var(--header-pb);
    max-width: 640px;

    .comments-count {
      font-size: var(--header-label-fs);
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

    .entry-page__comment:first-child {
      margin-top: 0;
    }
  }

  .pseudo-reply-form {
    padding: 0 17px;
    height: 48px;
    border-radius: 10px;
    color: var(--grey-color);
    background-color: var(--form-bg-color);
    border: 1px solid var(--form-border-color);
    line-height: 48px;
    cursor: pointer;
  }

  &-reply-form {
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
    max-width: 640px;

    &.bottom {
      margin-top: 0;
      padding-bottom: 30px;
    }
  }
}

.reply-form {
  --attachment-item-size: 96px;

  position: relative;
  padding: 13.5px 12px 12px 17px;
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
    background-color: var(--island-bg);
    border: 1px solid var(--form-border-color-hover);
    box-shadow: 0 0 0 3px var(--form-shadow);
  }

  &_focused {
    background-color: var(--island-bg);
    border: 1px solid var(--form-border-color-active) !important;
    box-shadow: 0 0 0 3px var(--form-shadow);
    transition: border 0.2s;
  }

  &_sending {
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
  }

  &_filled {
    background-color: var(--island-bg);
  }

  &__content {
    position: relative;
  }

  .attachments {
    display: flex;
    flex-direction: row;

    &__item {
      position: relative;

      &:not(:first-child) {
        margin-left: 20px;
      }

      .attachment {
        width: var(--attachment-item-size);
        height: var(--attachment-item-size);
        border-radius: 8px;
        box-shadow: 0 0 0 1px var(--border-a);
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
      }

      .delete-btn {
        position: absolute;
        top: -7px;
        right: -7px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--dropdown-bg);
        border-radius: 50%;
        box-shadow: 0 0 0 1px var(--border-a);
        cursor: pointer;

        .icon {
          color: red;
          width: 18px;
          height: 18px;
        }
      }
    }
  }

  &__text-field {
    position: relative;
    margin: 0;
    padding-top: 0;
    padding-bottom: 20px;
    width: 100%;
    display: inline-block;
    line-height: 26px;
    outline: none;
    user-select: auto;
  }

  .placeholder {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 16px;
    line-height: 22px;
    color: var(--grey-color);
  }

  &__actions {
    margin-top: 12px;
    display: flex;

    .attaches-actions {
      display: flex;
      align-items: center;

      .media-attach-btn {
        width: 20px;
        height: 20px;
        display: flex;
        color: #2ea83a;
        cursor: pointer;

        &_disabled {
          opacity: 0.5;
          cursor: default;
          pointer-events: none;
        }
      }

      .attachments-loader {
        margin-left: 15px;

        .custom-loader {
          &__loader-1,
          &__loader-2,
          &__loader-3 {
            background-color: var(--black-color);
          }
        }
      }

      .media-attach-input-hidden {
        display: none;
      }
    }

    .reply-actions {
      margin-left: auto;
      display: flex;
      align-items: center;

      .cancel-btn {
        margin-right: 15px;
        color: var(--grey-color);
        cursor: pointer;
      }

      .button {
        min-width: 100px;
        height: 40px;
        display: flex;
        align-items: center;

        .custom-loader {
          &__loader-1,
          &__loader-2,
          &__loader-3 {
            background-color: #fff;
          }
        }
      }
    }
  }
}

.ep-island {
  max-width: 640px;

  + .entry-page__video-block {
    margin-top: 15px;
  }
}

@media (hover: hover) {
  .reply-form {
    .attachments {
      &__item {
        .delete-btn {
          &:hover {
            .icon {
              opacity: 0.5;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .entry-page {
    &__header {
      padding-top: 15px;
    }

    &__comments {
      --header-pt: 20px;
      --header-pb: 5px;
      --header-label-fs: 18px;

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
    &:not(:first-child) {
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }

  .reply-form {
    --attachment-item-size: 50px;
  }
}

@media (max-width: 641px) {
  .ep-island {
    margin-left: 15px;
    margin-right: 15px;
  }
}

@media (min-width: 641px) {
  .ep-island {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 1021px) {
  .entry-page,
  .entry-page__comments {
    border-radius: 0;
  }
}
</style>
