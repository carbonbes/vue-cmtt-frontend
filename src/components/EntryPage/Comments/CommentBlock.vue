<template>
  <div
    class="entry-page__comment"
    :id="this.commentId"
    :class="commentClassObj"
    :style="{ '--level': this.comment.level }"
  >
    <div
      class="branch"
      :class="branchClassObj"
      @click="$emit('collapseBranch')"
      @mouseenter="setIdCommentBranchFocused(this.comment.replyTo)"
      @mouseleave="setIdCommentBranchFocused(0)"
      v-if="this.comment.level <= this.maxLvl && this.comment.level !== 0"
    />
    <div
      class="self-comment"
      :class="selfCommentClassObj"
      @mouseenter="setIsUnread(false)"
    >
      <div class="comment-content">
        <router-link
          class="avatar"
          :style="avatarStyleObj"
          :to="{ path: `/u/${authorId}` }"
        ></router-link>
        <router-link
          class="author-name"
          v-text="authorName"
          :to="{ path: `/u/${authorId}` }"
        ></router-link>
        <router-link
          class="up-arrow"
          :title="this.replyToAuthorName"
          :to="{
            query: { comment: this.replyTo },
          }"
          v-if="isReply"
          @click="$emit('temporaryHighlightParentComment')"
          @mouseenter="$emit('highlightParentComment')"
          @mouseleave="$emit('unhighlightParentComment')"
        >
          <up-arrow-icon />
        </router-link>
        <div class="break"></div>
        <div class="date-created">
          <date-time :date="dateCreated" type="0" />
        </div>
        <span class="is-author" v-if="isAuthorOfComment">автор</span>

        <div class="rating-wrapp">
          <div class="rating">
            <vote-icon
              class="icon dislike-icon"
              :class="dislikeBtnClassObj"
              @click="like('dislike')"
            />
            <div
              class="value-wrapp"
              :class="ratingValueWrappClassObj"
              @mouseenter="getLikes"
              @mouseleave="closeLikesPopup"
              @touchstart="getLikes"
              v-outside-click:[true]="closeLikesPopup"
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
                  <likes-popup
                    :likes="this.comment.likes.likesList"
                    type="comment"
                  />
                </div>
              </transition>
            </div>
            <vote-icon
              class="icon like-icon"
              :class="likeBtnClassObj"
              @click="like('like')"
            />
          </div>
        </div>

        <div class="text" v-if="text">
          <comment-text :string="text" />
        </div>

        <div class="media" v-if="media.length > 0">
          <comment-media :attachments="media" />
        </div>

        <span class="reply-btn us-none" @click="this.openReplyForm"
          >Ответить</span
        >

        <div class="more-items-btn" v-outside-click:[true]="closeEtcControls">
          <more-item-icon
            class="icon"
            @click="getCommentEtcControls(+this.commentId)"
          />
          <div class="dropdown" v-if="etcControlsDropdownIsOpen">
            <Dropdown :data="etcControlsConfig" />
          </div>
        </div>

        <ReplyForm
          :parentCommentId="this.commentId"
          :closeReplyForm="this.closeReplyForm"
          :closeEditForm="this.closeEditForm"
          :editMode="this.editMode"
          :selfCommentText="this.comment.text"
          :selfCommentMedia="this.comment.media"
          type="reply"
          v-if="replyFormIsOpen || this.editMode"
        />
      </div>
    </div>
    <div
      class="comment-replies"
      :class="commentRepliesClassObj"
      v-if="this.comment.replies.length > 0"
    >
      <template v-for="comment in this.comment.replies" :key="comment.id">
        <CommentBlock
          :comment="comment"
          :replyToAuthorName="authorName"
          :maxLvl="maxLvl"
          :idCommentBranchFocused="idCommentBranchFocused"
          :setIdCommentBranchFocused="setIdCommentBranchFocused"
          @highlight-parent-comment="highlightParentComment"
          @unhighlight-parent-comment="unhighlightParentComment"
          @collapse-branch="collapseBranch"
          @temporary-highlight-parent-pomment="temporaryHighlightParentComment"
          v-if="
            !this.ignoredProfiles.some(
              (subsite) => comment.author.id === subsite.id
            )
          "
        />
      </template>
    </div>
    <span
      class="branch-expand-btn"
      v-if="this.branchIsCollapsed"
      @click="expandBranch"
    >
      Раскрыть ветку
    </span>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import DateTime from "@/components/DateTime.vue";
import VoteIcon from "@/assets/logos/vote_icon.svg?inline";
import LikesPopup from "@/components/LikesPopup/LikesPopup.vue";
import CommentText from "@/components/EntryPage/Comments/CommentText.vue";
import CommentMedia from "@/components/EntryPage/Comments/CommentMedia.vue";
import ReplyForm from "@/components/EntryPage/Comments/ReplyForm.vue";
import UpArrowIcon from "@/assets/logos/up_arrow.svg?inline";
import MoreItemIcon from "@/assets/logos/more-item_icon.svg?inline";
import Dropdown from "@/components/Dropdown/Dropdown.vue";
import FlagIcon from "@/assets/logos/flag_icon.svg?inline";
import ChainIcon from "@/assets/logos/chain_icon.svg?inline";
import DeleteIcon from "@/assets/logos/delete_icon.svg?inline";
import DeleteThreadIcon from "@/assets/logos/delete-thread_icon.svg?inline";
import PencilIcon from "@/assets/logos/pencil_icon.svg?inline";

export default {
  name: "comment-block",

  props: [
    "comment",
    "replyToAuthorName",
    "maxLvl",
    "idCommentBranchFocused",
    "setIdCommentBranchFocused",
  ],

  components: {
    DateTime,
    VoteIcon,
    LikesPopup,
    CommentText,
    CommentMedia,
    ReplyForm,
    UpArrowIcon,
    MoreItemIcon,
    Dropdown,
    FlagIcon,
    ChainIcon,
    DeleteIcon,
    DeleteThreadIcon,
    PencilIcon,
  },

  data() {
    return {
      branchIsCollapsed: false,
      likesPopupIsFocused: false,
      likesPopupIsOpen: false,
      replyFormIsOpen: false,
      animationType: null,
      unread: null,
      highlighted: false,
      highlightedTimeout: null,
      etcControlsDropdownIsOpen: false,
      editMode: false,
    };
  },

  computed: {
    isReply() {
      return this.comment.replyTo !== 0;
    },

    replyTo() {
      return this.comment.replyTo;
    },

    commentClassObj() {
      return {
        "entry-page__comment_reply": this.comment.replyTo !== 0,
        "entry-page__comment_max-lvl": this.comment.level >= this.maxLvl,
      };
    },

    branchClassObj() {
      return {
        branch_highlighted:
          this.idCommentBranchFocused === this.comment.replyTo,
      };
    },

    selfCommentClassObj() {
      return {
        "self-comment_highlighted":
          this.highlighted ||
          this.commentId == this.temporaryHightlightComment ||
          this.unread,
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

    authorId() {
      return this.comment.author.id;
    },

    myId() {
      return this.auth.id;
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
      return this.comment.id.toString();
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

    queryCommentId() {
      return this.$route.query.comment;
    },

    isReplyMode() {
      return this.$route.query.mode === "reply";
    },

    lastViewedEntry() {
      return localStorage.getItem(`${this.entryId}-last-viewed`);
    },

    dateCreatedComment() {
      return this.comment.date * 1000;
    },

    etcControlsConfig() {
      if (
        this.comment.etcControls !== null &&
        !this.comment.etcControls.edit &&
        !this.comment.etcControls.remove &&
        !this.comment.etcControls.remove_thread
      ) {
        return {
          items: [
            { icon: ChainIcon, label: "Копировать ссылку", type: "default" },
            { icon: FlagIcon, label: "Пожаловаться", type: "default" },
          ],
        };
      } else if (
        this.comment.etcControls !== null &&
        this.comment.etcControls.edit &&
        !this.comment.etcControls.remove &&
        !this.comment.etcControls.remove_thread
      ) {
        return {
          items: [
            {
              icon: PencilIcon,
              label: "Редактировать",
              action: this.openEditForm,
              type: "default",
            },
            { icon: ChainIcon, label: "Копировать ссылку", type: "default" },
            { icon: FlagIcon, label: "Пожаловаться", type: "default" },
          ],
        };
      } else if (
        this.comment.etcControls !== null &&
        this.comment.etcControls.edit &&
        this.comment.etcControls.remove &&
        !this.comment.etcControls.remove_thread
      ) {
        return {
          items: [
            {
              icon: PencilIcon,
              label: "Редактировать",
              action: this.openEditForm,
              type: "default",
            },
            {
              icon: DeleteIcon,
              label: "Удалить",
              type: "default",
            },
            { icon: ChainIcon, label: "Копировать ссылку", type: "default" },
            { icon: FlagIcon, label: "Пожаловаться", type: "default" },
          ],
        };
      } else if (
        this.comment.etcControls !== null &&
        this.comment.etcControls.edit &&
        this.comment.etcControls.remove &&
        this.comment.etcControls.remove_thread
      ) {
        return {
          items: [
            {
              icon: PencilIcon,
              label: "Редактировать",
              action: this.openEditForm,
              type: "default",
            },
            {
              icon: DeleteIcon,
              label: "Удалить",
              type: "default",
            },
            {
              icon: DeleteThreadIcon,
              label: "Удалить ветку",
              type: "default",
            },
            { icon: ChainIcon, label: "Копировать ссылку", type: "default" },
            { icon: FlagIcon, label: "Пожаловаться", type: "default" },
          ],
        };
      } else if (
        this.comment.etcControls !== null &&
        !this.comment.etcControls.edit &&
        this.comment.etcControls.remove &&
        this.comment.etcControls.remove_thread
      ) {
        return {
          items: [
            {
              icon: DeleteIcon,
              label: "Удалить",
              type: "default",
            },
            {
              icon: DeleteThreadIcon,
              label: "Удалить ветку",
              type: "default",
            },
            { icon: ChainIcon, label: "Копировать ссылку", type: "default" },
            { icon: FlagIcon, label: "Пожаловаться", type: "default" },
          ],
        };
      } else if (
        this.comment.etcControls !== null &&
        this.comment.etcControls.edit &&
        !this.comment.etcControls.remove &&
        this.comment.etcControls.remove_thread
      ) {
        return {
          items: [
            {
              icon: PencilIcon,
              label: "Редактировать",
              action: this.openEditForm,
              type: "default",
            },
            {
              icon: DeleteIcon,
              label: "Удалить",
              type: "default",
            },
            {
              icon: DeleteThreadIcon,
              label: "Удалить ветку",
              type: "default",
            },
            { icon: ChainIcon, label: "Копировать ссылку", type: "default" },
            { icon: FlagIcon, label: "Пожаловаться", type: "default" },
          ],
        };
      } else if (
        this.comment.etcControls !== null &&
        this.comment.etcControls.edit &&
        this.comment.etcControls.remove &&
        !this.comment.etcControls.remove_thread
      ) {
        return {
          items: [
            {
              icon: PencilIcon,
              label: "Редактировать",
              action: this.openEditForm,
              type: "default",
            },
            {
              icon: DeleteIcon,
              label: "Удалить",
              type: "default",
            },
            { icon: ChainIcon, label: "Копировать ссылку", type: "default" },
            { icon: FlagIcon, label: "Пожаловаться", type: "default" },
          ],
        };
      }
    },

    ignoredProfiles() {
      return JSON.parse(localStorage.getItem("ignoredProfiles"));
    },

    ...mapGetters([
      "auth",
      "entryId",
      "entryAuthorId",
      "temporaryHightlightComment",
    ]),
  },

  methods: {
    collapseBranch() {
      this.branchIsCollapsed = true;
    },

    expandBranch() {
      this.branchIsCollapsed = false;
    },

    getLikes() {
      this.likesPopupIsFocused = true;

      if (
        Object.keys(this.comment.likes.likesList).length > 0 &&
        !this.comment.likes.newLikes
      ) {
        this.likesPopupIsOpen = true;
      } else if (
        this.comment.likes.likesList.length === 0 ||
        (Object.keys(this.comment.likes.likesList).length > 0 &&
          this.comment.likes.newLikes)
      ) {
        if (this.likesPopupIsFocused) {
          this.requestLikesList({ id: this.commentId, type: "comment" }).then(
            () => {
              if (
                this.likesPopupIsFocused &&
                Object.keys(this.comment.likes.likesList).length !== 0
              ) {
                this.likesPopupIsOpen = true;
              }
            }
          );
        }
      }
    },

    closeLikesPopup() {
      this.likesPopupIsFocused = false;
      this.likesPopupIsOpen = false;
    },

    highlightParentComment() {
      this.highlighted = true;
    },

    unhighlightParentComment() {
      this.highlighted = false;
    },

    temporaryHighlightParentComment() {
      this.highlighted = true;
      this.highlightedTimeout = setTimeout(() => {
        this.highlighted = false;
        clearTimeout(this.highlightedTimeout);
      }, 3000);
    },

    openReplyForm() {
      this.replyFormIsOpen = true;
    },

    closeReplyForm() {
      this.replyFormIsOpen = false;
    },

    openEditForm() {
      this.editMode = true;
      this.etcControlsDropdownIsOpen = false;
    },

    closeEditForm() {
      this.editMode = false;
    },

    like(actionType) {
      if (actionType === "like") {
        this.postCommentLike({
          id: this.commentId,
          type: "comment",
          sign: this.commentIsLiked === 1 ? 0 : -1 ? 1 : 1,
        });
      } else if (actionType === "dislike") {
        this.postCommentLike({
          id: this.commentId,
          type: "comment",
          sign: this.commentIsLiked === -1 ? 0 : 1 ? -1 : -1,
        });
      }
    },

    setIsUnread(value) {
      this.unread = value;
    },

    toggleOpenEtcControls() {
      this.etcControlsDropdownIsOpen = !this.etcControlsDropdownIsOpen;
    },

    closeEtcControls() {
      this.etcControlsDropdownIsOpen = false;
    },

    getCommentEtcControls(id) {
      if (
        this.comment.etcControls === null &&
        !this.etcControlsDropdownIsOpen
      ) {
        this.requestCommentEtcControls(id).then(() => {
          this.etcControlsDropdownIsOpen = true;
        });
      } else if (Object.keys(this.comment.etcControls).length > 0) {
        this.etcControlsDropdownIsOpen = true;
      }
    },

    ...mapActions([
      "requestLikesList",
      "postCommentLike",
      "requestCommentEtcControls",
    ]),

    ...mapMutations(["setCommentPrevLiked"]),
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
    if (this.commentId == this.queryCommentId && this.isReplyMode) {
      this.openReplyForm();
    }

    if (
      this.dateCreatedComment > this.lastViewedEntry &&
      this.authorId !== this.myId
    ) {
      this.setIsUnread(true);
    }
  },
};
</script>

<style lang="scss">
.entry-page {
  &__comment {
    --branch-gap: 21px;
    --comment-content-right-gap: 85px;
    --padding-highlighted: 5px 21px;
    --right-gap-highlighted: -21px;
    --width-highlighted: 100%;

    position: relative;
    margin-top: 9px;
    font-size: 16px;
    line-height: 1.5em;

    &_reply {
      margin-top: 0;
      padding-left: var(--branch-gap);

      &:not(.entry-page__comment_max-lvl):last-child {
        > .branch {
          height: 0;
        }
      }
    }

    &_max-lvl {
      padding-left: 0;

      .branch {
        display: none;
      }
    }

    .branch {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--branch-gap);
      height: 100%;
      border-left: 1px solid var(--branch-color);
      cursor: pointer;
      z-index: 1;

      &_highlighted {
        border-color: var(--branch-hovered-color);
        box-shadow: inset 1px 0 0 0 var(--branch-hovered-color);

        &::before {
          border-color: var(--branch-hovered-color) !important;
          box-shadow: inset 1px -1px 0 0 var(--branch-hovered-color);
        }
      }

      &::before {
        content: "";
        position: absolute;
        margin-left: -1px;
        box-sizing: content-box;
        display: block;
        width: 12px;
        height: 36px;
        border: solid var(--branch-color);
        border-width: 0 0 1px 1px;
        border-bottom-left-radius: 8px;
        z-index: 1;
      }
    }

    .self-comment {
      position: relative;
      padding-top: 18px;
      padding-bottom: 5px;

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

      .comment-content {
        position: relative;
        display: flex;
        flex-wrap: wrap;

        .avatar {
          margin-top: 2px;
          margin-right: 10px;
          margin-bottom: -32px;
          width: 32px;
          height: 32px;
          display: flex;
          border-radius: 50%;
          box-shadow: inset 0 0 0 1px var(--box-shadow-avatar);
          background-size: cover;
          background-position: 50% 50%;
          order: -2;
        }

        .author-name {
          margin-right: 8px;
          white-space: nowrap;
          font-weight: 500;
          line-height: 20px;
          order: -2;
        }

        .up-arrow {
          display: flex;
          align-items: center;
          opacity: 0;
          order: -2;

          svg {
            width: 14px;
            height: 14px;
            color: var(--grey-color);
          }
        }

        .break {
          flex-basis: 100%;
        }

        .date-created {
          margin-left: 42px;
          white-space: nowrap;
          line-height: 16px;
          font-size: 12px;
          color: var(--grey-color);
        }

        .is-author {
          margin-left: 8px;
          white-space: nowrap;
          line-height: 16px;
          font-size: 12px;
          color: var(--comment-self-author-badge);
          z-index: 1;
        }

        .rating-wrapp {
          --action-gap: 8px;

          margin-left: auto;
          padding-left: 25px;
          display: flex;
          order: -2;

          .rating {
            margin-left: auto;
            height: 20px;
            display: flex;
            align-items: center;
            line-height: 20px;

            .icon {
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

            .value-wrapp {
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

              .value {
                font-weight: 500;
                font-size: 14px;
                cursor: default;

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

              .popup {
                position: absolute;
                top: 100%;
                margin-top: 5px;
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
        }

        .text {
          margin: 6px 0;
          padding-right: var(--comment-content-right-gap);
          max-width: 100%;
          flex-basis: 100%;
          word-wrap: break-word;

          p {
            margin: 0;

            &:not(:last-child) {
              margin-bottom: 6px;
            }
          }

          .quote {
            padding-top: 6px;
            padding-bottom: 6px;
            display: flex;

            .icon {
              min-width: 16px;
              min-height: 12px;
              margin-right: 10px;
              color: #9b9b9b;
            }

            &-content {
              min-width: 0;
            }
          }

          + .media {
            margin-top: 0;
          }
        }

        .media {
          margin: 10px 0;
          max-width: 100%;
          padding-right: var(--comment-content-right-gap);
          flex-basis: 100%;

          .img-wrapp {
            + .img-wrapp,
            + .media-video {
              margin-top: 7px;
            }
          }

          .media-video {
            + .img-wrapp,
            + .media-video {
              margin-top: 7px;
            }
          }
        }

        .reply-btn {
          font-size: 14px;
          line-height: 20px;
          color: var(--grey-color);
          cursor: pointer;
        }

        .more-items-btn {
          position: relative;
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 20px;
          color: var(--grey-color);

          > .icon {
            width: 16px;
            height: 16px;
            cursor: pointer;
          }

          .dropdown {
            position: absolute;
            top: 100%;
            margin-top: 5px;
            z-index: 2;
          }
        }

        .author-name,
        .date-created {
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
          max-width: max-content;
        }
      }
    }

    .comment-replies {
      position: relative;

      &_collapsed {
        display: none;
      }
    }

    .branch-expand-btn {
      color: var(--blue-color);
      font-size: 15px;
      cursor: pointer;
    }
  }
}

@media (hover: hover) {
  .entry-page__comment {
    .self-comment {
      .comment-content {
        &:hover {
          .rating-wrapp .rating {
            .dislike-icon,
            .like-icon {
              opacity: 1;
            }
          }

          .up-arrow {
            opacity: 1;
          }
        }

        .avatar {
          &:hover {
            ~ .author-name {
              color: var(--blue-color);
            }
          }
        }

        .author-name {
          &:hover {
            color: var(--blue-color);
          }
        }

        .reply-btn,
        .more-items-btn svg,
        .up-arrow svg {
          &:hover {
            color: var(--blue-color);
          }
        }

        .value-wrapp {
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

        .rating-wrapp .rating .dislike-icon {
          &:hover {
            color: var(--red-color);
          }
        }

        .rating-wrapp .rating .like-icon {
          &:hover {
            color: var(--green-color);
          }
        }

        .cancel-btn {
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

    .branch-expand-btn:hover {
      color: var(--red-color);
    }
  }
}

@media (max-width: 768px) {
  .entry-page {
    &__comment {
      --branch-gap: 19px;
      --comment-content-right-gap: 0;
      --padding-highlighted: 8px 0;
      --right-gap-highlighted: -15px;
      --width-highlighted: 100vh;

      &_reply {
        &::before {
          margin-left: -20px;
        }
      }

      .self-comment {
        .comment-content {
          .rating-wrapp {
            --action-gap: 2px;

            order: 1;

            .rating {
              .icon.dislike-icon,
              .icon.like-icon {
                opacity: 1;
              }

              .value-wrapp {
                padding: 0 13px;
                min-width: unset;
                justify-content: flex-end;
                background: none;

                .popup {
                  transform: translateX(30px);
                }
              }
            }
          }

          .up-arrow {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>