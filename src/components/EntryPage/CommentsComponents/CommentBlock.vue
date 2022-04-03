<template>
  <div
    class="entry-page__comment"
    :class="replyCommentClassObj"
    ref="commentRef"
  >
    <div class="comment-content" :class="commentContentClassObj">
      <a class="avatar" :style="avatarStyleObj" :href="`u/${authorId}`"></a>
      <a
        class="author-name"
        :class="isAuthorOfCommentClassObj"
        v-text="author"
        :href="`u/${authorId}`"
      ></a>
      <router-link
        class="up-arrow"
        :title="this.replyToAuthorName"
        :to="{ query: { comment: this.comment.replyTo } }"
        v-if="isReply"
        @mouseenter="highlightParentComment(this.comment.replyTo)"
        @mouseleave="clearHighlightParentComment()"
      >
        <up-arrow-icon />
      </router-link>
      <div class="break"></div>
      <a class="date-created" href="#">
        <date-time :date="dateCreated" type="0" />
      </a>

      <div class="rating-wrapp">
        <div class="rating">
          <vote-icon class="icon dislike-icon" />
          <div
            class="value-wrapp"
            :class="ratingValueWrappClassObj"
            @mouseenter="getLikes"
            @mouseleave="closeLikesPopup"
          >
            <div
              class="value"
              :class="ratingValueClassObj"
              v-text="commentRatingFormatted"
            ></div>
            <transition name="popup">
              <div class="popup" v-if="likesPopupIsOpen">
                <likes-popup :likes="this.likesList" type="comment" />
              </div>
            </transition>
          </div>
          <vote-icon class="icon like-icon" />
        </div>
      </div>

      <div class="text" v-if="text">
        <comment-text :string="text" />
      </div>

      <div class="media" v-if="media.length > 0">
        <comment-media :attachments="media" />
      </div>
      <span class="reply-btn">Ответить</span>
    </div>
    <div
      class="comment-replies"
      :class="commentRepliesClassObj"
      v-if="this.comment.replies.length > 0"
    >
      <div class="branch-collapse-btn" @click="toggleBranchCollapse" />
      <comment-block
        v-for="comment in this.comment.replies"
        :comment="comment"
        :replyToAuthorName="authorName"
        :queryCommentId="queryCommentId"
        :key="comment.id"
      />
    </div>
    <span
      class="branch-expand-btn"
      v-if="branchIsCollapsed"
      @click="toggleBranchCollapse"
    >
      Раскрыть
    </span>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import DateTime from "@/components/DateTime.vue";
import VoteIcon from "@/assets/logos/vote_icon.svg?inline";
import LikesPopup from "@/components/LikesPopup.vue";
import CommentText from "@/components/EntryPage/CommentsComponents/CommentText.vue";
import CommentMedia from "@/components/EntryPage/CommentsComponents/CommentMedia.vue";
import UpArrowIcon from "@/assets/logos/up_arrow.svg?inline";

export default {
  name: "comment-block",

  props: {
    comment: Object,
    replyToAuthorName: String,
    queryCommentId: String,
  },

  components: {
    DateTime,
    VoteIcon,
    LikesPopup,
    CommentText,
    CommentMedia,
    UpArrowIcon,
  },

  data() {
    return {
      branchIsCollapsed: false,
      likesPopupIsFocused: false,
      likesPopupIsOpen: false,
    };
  },

  computed: {
    isReply() {
      return this.comment.replyTo !== 0;
    },

    replyCommentClassObj() {
      return {
        "entry-page__comment_reply": this.comment.replyTo !== 0,
      };
    },

    commentContentClassObj() {
      return {
        "comment-content_highlighted":
          this.commentId == this.idCommentHighlight,
      };
    },

    commentRepliesClassObj() {
      return {
        "comment-replies_collapsed": this.branchIsCollapsed,
      };
    },

    avatarStyleObj() {
      return {
        backgroundImage: `url(https://leonardo.osnova.io/${this.comment.author.avatar.data.uuid}/-/scale_crop/64x64/)`,
      };
    },

    author() {
      return this.comment.author.name;
    },

    authorId() {
      return this.comment.author.id;
    },

    authorName() {
      return this.comment.author.name;
    },

    isAuthorOfComment() {
      return this.authorId === this.entryAuthorId;
    },

    isAuthorOfCommentClassObj() {
      return {
        "author-name_highlighted": this.isAuthorOfComment,
      };
    },

    dateCreated() {
      return this.comment.date * 1000;
    },

    text() {
      return this.comment.text;
    },

    media() {
      return this.comment.media;
    },

    ratingValueWrappClassObj() {
      return {
        "value-wrapp_neutral": this.commentRating === 0,
        "value-wrapp_positive": this.commentRating > 0,
        "value-wrapp_negative": this.commentRating < 0,
      };
    },

    ratingValueClassObj() {
      return {
        value_neutral: this.commentRating === 0,
        value_positive: this.commentRating > 0,
        value_negative: this.commentRating < 0,
      };
    },

    commentId() {
      return this.comment.id;
    },

    commentRating() {
      return this.comment.likes.summ;
    },

    commentRatingFormatted() {
      if (this.comment.likes.summ < 0) {
        return this.comment.likes.summ.toString().replace(/\-/g, "—");
      } else {
        return this.comment.likes.summ;
      }
    },

    ...mapGetters(["entryAuthorId", "likesList", "idCommentHighlight"]),
  },

  methods: {
    toggleBranchCollapse() {
      this.branchIsCollapsed = !this.branchIsCollapsed;
    },

    getLikes() {
      this.likesPopupIsFocused = true;

      this.requestLikesList({ id: this.commentId, type: "comment" }).then(
        () => {
          if (
            this.likesPopupIsFocused &&
            Object.keys(this.likesList).length !== 0
          ) {
            this.likesPopupIsOpen = true;
          }
        }
      );
    },

    closeLikesPopup() {
      this.likesPopupIsFocused = false;
      this.likesPopupIsOpen = false;
    },

    highlightParentComment(id) {
      this.setIdCommentHighlight(id);
    },

    clearHighlightParentComment() {
      this.clearIdCommentHighlight();
    },

    ...mapActions(["requestLikesList"]),
    ...mapMutations(["setIdCommentHighlight", "clearIdCommentHighlight"]),
  },

  mounted() {
    if (this.queryCommentId && this.queryCommentId === this.commentId) {
      this.$refs.commentRef.scrollIntoView();
    }
  },
};
</script>

<style lang="scss">
.entry-page {
  &__comment {
    margin-top: 9px;
    font-size: 16px;
    line-height: 1.5em;

    &_reply {
      margin-top: 0;

      &::before {
        content: "";
        position: absolute;
        margin-left: -22px;
        box-sizing: content-box;
        display: block;
        width: 12px;
        height: 36px;
        border: solid var(--branch-color);
        border-width: 0 0 1px 1px;
        border-bottom-left-radius: 8px;
      }

      &:not(:last-child) {
        border-left: 1px solid var(--branch-color);
      }

      &:last-child {
        border-left: 1px solid transparent;
      }
    }

    & .comment-content {
      position: relative;
      padding-top: 18px;
      padding-bottom: 5px;
      display: flex;
      flex-wrap: wrap;

      &_highlighted {
        &::before {
          content: "";
          position: absolute;
          padding: 5px 23px;
          top: 0;
          right: -24px;
          width: 100%;
          height: 100%;
          background: var(--comment-highlight-bg);
        }
      }

      & .avatar {
        margin-top: 2px;
        margin-right: 10px;
        margin-bottom: -32px;
        width: 32px;
        height: 32px;
        display: flex;
        border-radius: 50%;
        box-shadow: var(--box-shadow-avatar);
        background-size: cover;
        order: -2;
      }

      & .author-name {
        margin-right: 8px;
        white-space: nowrap;
        font-weight: 500;
        line-height: 20px;
        order: -2;

        &_highlighted {
          padding: 0 3px;
          border-radius: 2px;
          background: var(--self-author-highlight-color);
        }
      }

      & .up-arrow {
        display: flex;
        align-items: center;
        opacity: 0;
        order: -2;

        & svg {
          width: 14px;
          height: 14px;
          color: var(--grey-color);
        }
      }

      .break {
        flex-basis: 100%;
      }

      & .date-created {
        margin-left: 42px;
        white-space: nowrap;
        line-height: 16px;
        font-size: 12px;
        color: var(--grey-color);
      }

      & .rating-wrapp {
        margin-left: auto;
        display: flex;
        order: -2;

        & .rating {
          margin-left: auto;
          height: 20px;
          display: flex;
          align-items: center;
          line-height: 20px;

          & .icon {
            --action-gap: 10px;
            width: 18px;
            height: 18px;
            color: var(--grey-color);
            cursor: pointer;

            &.dislike-icon {
              margin-right: var(--action-gap);
              transform: rotate(180deg);
              opacity: 0;

              &_pressed {
                color: var(--red-color);
                opacity: 1;
              }
            }

            &.like-icon {
              margin-left: var(--action-gap);
              opacity: 0;

              &_pressed {
                color: var(--green-color);
                opacity: 1;
              }
            }
          }

          & .value-wrapp {
            position: relative;
            min-width: 40px;
            padding: 0 12.5px;
            display: flex;
            justify-content: center;
            border-radius: 4px;

            &_neutral {
              background: var(--comment-rating-value-wrapp-bg-neutral);
            }

            &_positive {
              background: var(--comment-rating-value-wrapp-bg-positive);
            }

            &_negative {
              background: var(--comment-rating-value-wrapp-bg-negative);
            }

            & .value {
              font-weight: 500;
              font-size: 14px;

              &_neutral {
                color: var(--grey-color);
              }

              &_positive {
                color: var(--green-color);
              }

              &_negative {
                color: var(--red-color);
              }
            }

            & .popup {
              position: absolute;
              top: 100%;
              margin-top: 5px;
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
          }
        }
      }

      & .text {
        margin: 6px 0;
        padding-right: 85px;
        max-width: 100%;
        flex-basis: 100%;
        word-wrap: break-word;

        & p {
          margin: 0;

          &:not(:last-child) {
            margin-bottom: 6px;
          }
        }
      }

      & .media {
        margin: 10px 0;
        max-width: 100%;
        padding-right: 85px;
        flex-basis: 100%;

        & .media-wrapp {
          & + .media-wrapp {
            margin-top: 7px;
          }
        }
      }

      & .reply-btn {
        font-size: 14px;
        line-height: 20px;
        color: var(--grey-color);
        cursor: pointer;
      }

      & .avatar,
      .author-name,
      .up-arrow,
      .date-created,
      .text,
      .media,
      .reply-btn {
        z-index: 1;
      }

      & .author-name,
      .date-created {
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
        max-width: max-content;
      }
    }

    & .comment-replies {
      position: relative;

      &_collapsed {
        display: none;
      }

      & .entry-page__comment {
        padding-left: 21px;
      }

      & .branch-collapse-btn {
        position: absolute;
        width: 21px;
        height: 100%;
        cursor: pointer;
        z-index: 1;
      }
    }

    & .branch-expand-btn {
      color: var(--blue-color);
      cursor: pointer;
    }
  }
}

@media (hover: hover) {
  .entry-page__comment {
    & .comment-content {
      &:hover {
        & .rating-wrapp .rating {
          & .dislike-icon,
          .like-icon {
            opacity: 1;
          }
        }

        & .up-arrow {
          opacity: 1;
        }
      }

      & .reply-btn {
        &:hover {
          color: var(--blue-color);
        }
      }

      & .value-wrapp {
        &:hover {
          &::before {
            content: "";
            position: absolute;
            top: 0;
            width: 40px;
            height: 30px;
          }
        }
      }

      & .rating-wrapp .rating .dislike-icon {
        &:hover {
          color: var(--red-color);
        }
      }

      & .rating-wrapp .rating .like-icon {
        &:hover {
          color: var(--green-color);
        }
      }
    }

    /* & .branch-collapse-btn {
      &:hover {
        border-left: 2px solid #4683d9;

        & ~ .entry-page__comment_reply {
          & .comment-reply {
            &::before {
              border-color: #4683d9;
            }
          }
        }
      }
    } */

    & .branch-expand-btn {
      &:hover {
        color: var(--red-color);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .entry-page {
    &__comment {
      & .comment-content {
        & .rating-wrapp {
          order: 1;

          & .rating {
            & .icon.dislike-icon,
            .icon.like-icon {
              opacity: 1;
            }

            & .value-wrapp {
              padding: 0 2px;
              min-width: unset;
              justify-content: flex-end;
              background: none;

              & .popup {
                transform: translateX(30px);
              }
            }
          }
        }
      }
    }
  }
}
</style>