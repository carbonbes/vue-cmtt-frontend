<template>
  <div
    class="entry-page__comment"
    :id="this.commentId"
    :class="replyCommentClassObj"
  >
    <div class="comment-content" :class="commentContentClassObj">
      <a class="avatar" :style="avatarStyleObj" :href="`u/${authorId}`"></a>
      <a class="author-name" v-text="author" :href="`u/${authorId}`"></a>
      <router-link
        class="up-arrow"
        :title="this.replyToAuthorName"
        :to="{
          query: { comment: this.replyTo },
          meta: { smooth: true },
        }"
        v-if="isReply"
        @click="highlightFocusedComment(this.replyTo)"
        @mouseenter="highlightParentComment(this.replyTo)"
        @mouseleave="clearHighlightParentComment()"
      >
        <up-arrow-icon />
      </router-link>
      <div class="break"></div>
      <a class="date-created" href="#">
        <date-time :date="dateCreated" type="0" />
      </a>
      <span class="is-author" v-if="isAuthorOfComment">автор</span>

      <div class="rating-wrapp">
        <div class="rating">
          <vote-icon class="icon dislike-icon" :class="dislikeBtnClassObj" />
          <div
            class="value-wrapp"
            :class="ratingValueWrappClassObj"
            @mouseenter="getLikes"
            @mouseleave="closeLikesPopup"
          >
            <transition-group
              class="value"
              :class="ratingValueClassObj"
              :name="this.animationType === 'up' ? 'value_up' : 'value_down'"
              tag="div"
              ><div
                v-text="commentRatingFormatted"
                :key="commentRatingFormatted"
              ></div
            ></transition-group>
            <transition name="popup">
              <div class="popup" v-if="likesPopupIsOpen">
                <likes-popup :likes="this.likesList" type="comment" />
              </div>
            </transition>
          </div>
          <vote-icon class="icon like-icon" :class="likeBtnClassObj" />
        </div>
      </div>

      <div class="text" v-if="text">
        <comment-text :string="text" />
      </div>

      <div class="media" v-if="media.length > 0">
        <comment-media :attachments="media" />
      </div>

      <span class="reply-btn" @click="this.openReplyFrom(this.commentId)"
        >Ответить</span
      >

      <div
        class="reply-form"
        :class="replyFormClassObj"
        v-if="this.idCommentVisibledReplyForm === this.commentId"
      >
        <div
          class="content-editable"
          contenteditable="true"
          autofocus
          @click="this.focusReplyForm"
          v-on-click-outside="this.unfocusReplyForm"
        ></div>
        <div class="content-actions">
          <div class="attaches-actions"></div>
          <div class="reply-actions">
            <div class="cancel-btn" @click="this.closeReplyForm">Отменить</div>
            <button class="button button_b">
              <div class="button__label">Ответить</div>
            </button>
          </div>
        </div>
      </div>
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
        :key="comment.id"
      />
    </div>
    <span
      class="branch-expand-btn"
      v-if="branchIsCollapsed"
      @click="toggleBranchCollapse"
    >
      Раскрыть ветку
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
      timeout: false,
      replyFormFocusTimeout: false,
      replyFormFocused: false,
      isReplying: false,
      animationType: null,
    };
  },

  computed: {
    isReply() {
      return this.comment.replyTo !== 0;
    },

    replyTo() {
      return this.comment.replyTo;
    },

    replyCommentClassObj() {
      return {
        "entry-page__comment_reply": this.comment.replyTo !== 0,
        /* "entry-page__comment_max-lvl": this.comment.level > 3, */
      };
    },

    commentContentClassObj() {
      return {
        "comment-content_highlighted":
          this.commentId == this.hoveredHighlightComment ||
          this.commentId == this.temporaryHightlightComment,
        /* "comment-content_replying": this.isReplying, */
      };
    },

    commentRepliesClassObj() {
      return {
        "comment-replies_collapsed": this.branchIsCollapsed,
      };
    },

    avatarStyleObj() {
      if (this.comment.author.avatar_url) {
        return {
          backgroundImage: `url(${this.comment.author.avatar_url})`,
        };
      } else
        return {
          backgroundImage: `url(https://leonardo.osnova.io/${this.comment.author.avatar.data.uuid})`,
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

    likeBtnClassObj() {
      return {
        "like-icon_pressed": this.commentIsLiked === 1,
      };
    },

    dislikeBtnClassObj() {
      return {
        "dislike-icon_pressed": this.commentIsLiked === -1,
      };
    },

    commentIsLiked() {
      return this.comment.likes.isLiked;
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

    replyFormClassObj() {
      return {
        "reply-form_focused": this.replyFormFocused,
      };
    },

    queryCommentId() {
      return this.$route.query.comment;
    },

    ...mapGetters([
      "entryAuthorId",
      "likesList",
      "hoveredHighlightComment",
      "temporaryHightlightComment",
      "idCommentVisibledReplyForm",
    ]),
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
      this.setHoveredHighlightComment(id);
    },

    clearHighlightParentComment() {
      this.clearHoveredHighlightComment();
    },

    highlightFocusedComment(id) {
      this.setTemporaryHightlightComment(id);
      this.timeout = setTimeout(() => {
        this.clearTemporaryHightlightComment();
        clearTimeout(this.timeout);
      }, 3000);
    },

    openReplyFrom(id) {
      this.setIdCommentVisibledReplyForm(id);
      this.replyFormFocusTimeout = setTimeout(() => {
        this.focusReplyForm();
      }, 50);
      this.isReplying = true;
    },

    closeReplyForm() {
      this.clearIdCommentVisibledReplyForm();
      clearTimeout(this.replyFormFocusTimeout);
      this.isReplying = false;
    },

    focusReplyForm() {
      this.replyFormFocused = true;
    },

    unfocusReplyForm() {
      this.replyFormFocused = false;
    },

    ...mapActions(["requestLikesList"]),

    ...mapMutations([
      "setHoveredHighlightComment",
      "clearHoveredHighlightComment",
      "setTemporaryHightlightComment",
      "clearTemporaryHightlightComment",
      "setIdCommentVisibledReplyForm",
      "clearIdCommentVisibledReplyForm",
    ]),
  },

  watch: {
    commentRating(newValue, oldValue) {
      if (newValue > oldValue) {
        this.animationType = "up";
      } else {
        this.animationType = "down";
      }
    },
  },

  mounted() {
    if (this.commentId == this.queryCommentId) {
      this.highlightFocusedComment(this.queryCommentId);
    }
  },

  beforeUnmount() {
    clearTimeout(this.timeout);
    clearTimeout(this.replyFormFocusTimeout);
  },
};
</script>

<style lang="scss">
.entry-page {
  &__comment {
    --branch-gap: 21px;
    --text-right-gap: 85px;
    --padding-highlighted: 5px 23px;
    --right-gap-highlighted: -25px;
    --width-highlighted: 100%;

    margin-top: 9px;
    font-size: 16px;
    line-height: 1.5em;

    &_reply {
      margin-top: 0;
      padding-left: var(--branch-gap);

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
        z-index: 1;
      }

      &:not(.entry-page__comment_max-lvl):not(:last-child) {
        border-left: 1px solid var(--branch-color);
      }

      &:last-child {
        border-left: 1px solid transparent;
      }
    }

    &_max-lvl {
      padding-left: 0;

      &::before {
        border-color: transparent;
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
          top: 0;
          right: var(--right-gap-highlighted);
          padding: var(--padding-highlighted);
          width: var(--width-highlighted);
          height: 100%;
          background: var(--comment-highlight-bg);
        }
      }

      &_replying {
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: -21px;
          width: calc(100% + 42px);
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

      & .is-author {
        margin-left: 8px;
        white-space: nowrap;
        line-height: 16px;
        font-size: 12px;
        color: #4683d9;
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
        padding-right: var(--text-right-gap);
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

      & .reply-form {
        position: relative;
        margin-top: 12px;
        margin-bottom: 18px;
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

        & .content-editable {
          padding-bottom: 40px;
          outline: none;
        }

        & .content-actions {
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
              height: 40px;
            }
          }
        }
      }

      & .avatar,
      .author-name,
      .up-arrow,
      .date-created,
      .like-icon,
      .dislike-icon,
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

      & .branch-collapse-btn {
        position: absolute;
        width: var(--branch-gap);
        height: 100%;
        cursor: pointer;
        z-index: 2;
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

      & .cancel-btn {
        &:hover {
          opacity: 0.8;
        }
      }
    }

    /* & .branch-collapse-btn {
      &:hover {
        background: var(--branch-collapse-btn-bg);
        border-radius: 4px;
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
      --branch-gap: 19px;
      --text-right-gap: 0;
      --padding-highlighted: 8px 0;
      --right-gap-highlighted: -15px;
      --width-highlighted: 100vh;

      &_reply {
        &::before {
          margin-left: -20px;
        }
      }

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

        & .up-arrow {
          opacity: 1;
        }
      }
    }
  }
}
</style>