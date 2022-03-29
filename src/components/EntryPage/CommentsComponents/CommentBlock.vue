<template>
  <div class="entry-page__comment" :class="replyCommentClassObj">
    <div class="comment-content" :class="replyCommentContentClassObj">
      <a class="avatar" :style="avatarStyleObj" :href="`u/${authorId}`"></a>
      <a class="author" v-text="author" :href="`u/${authorId}`"></a>
      <div class="break"></div>
      <a class="date-created" href="">
        <date-time :date="dateCreated" type="0" />
      </a>
      <div class="text" v-if="text">
        <comment-text :string="text" />
      </div>
    </div>
    <template v-if="this.comment.replies.length > 0">
      <div class="comment-replies" :class="repliesCollapseClassObj">
        <div class="branch-collapse-btn" @click="toggleBranchCollapse" />
        <comment-block
          v-for="comment in this.comment.replies"
          :comment="comment"
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
    </template>
  </div>
</template>

<script>
import DateTime from "@/components/DateTime.vue";
import CommentText from "@/components/EntryPage/CommentsComponents/CommentText.vue";

export default {
  name: "comment-block",

  props: {
    comment: Object,
  },

  components: {
    DateTime,
    CommentText,
  },

  data() {
    return {
      branchIsCollapsed: false,
    };
  },

  computed: {
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

    dateCreated() {
      return this.comment.date * 1000;
    },

    text() {
      return this.comment.text;
    },

    replyCommentContentClassObj() {
      return {
        "comment-content_reply": this.comment.level > 0,
      };
    },

    replyCommentClassObj() {
      return {
        "entry-page__comment_reply": this.comment.level > 0,
      };
    },

    repliesCollapseClassObj() {
      return {
        "comment-replies_collapse": this.branchIsCollapsed,
      };
    },
  },

  methods: {
    toggleBranchCollapse() {
      this.branchIsCollapsed = !this.branchIsCollapsed;
    },
  },
};
</script>

<style lang="scss">
.entry-page {
  &__comment {
    margin-top: 30px;
    font-size: 16px;
    line-height: 1.5em;

    &_reply {
      margin-top: 0;

      &::before {
        content: "";
        position: absolute;
        margin-left: -21px;
        width: 12px;
        height: 35px;
        border: solid var(--branch-color);
        border-width: 0 0 1px 1px;
        border-bottom-left-radius: 8px;
      }
    }

    & .comment-content {
      display: flex;
      flex-wrap: wrap;

      &_reply {
        padding-top: 18px;
      }

      & .avatar {
        margin-right: 10px;
        width: 32px;
        height: 32px;
        display: block;
        border-radius: 50%;
        box-shadow: var(--box-shadow-avatar);
        background-size: cover;
        order: -2;
      }

      & .author {
        font-weight: 500;
        line-height: 20px;
        order: -2;
      }

      & .break {
        flex-basis: 100%;
      }

      & .date-created {
        line-height: 16px;
        font-size: 12px;
        color: var(--grey-color);
      }

      & .text {
        margin: 6px 0;
        padding-right: 85px;
        flex-basis: 100%;
        word-wrap: break-word;

        & p {
          margin: 0;

          &:not(:last-child) {
            margin-bottom: 6px;
          }
        }
      }
    }

    & .comment-replies {
      position: relative;

      &_collapse {
        display: none;
      }

      & .entry-page__comment {
        padding-left: 21px;
      }
    }

    & .branch-collapse-btn {
      position: absolute;
      top: 0;
      left: 0;
      width: 21px;
      height: 100%;
      border-left: 1px solid var(--branch-color);
      cursor: pointer;
      z-index: 2;
    }

    & .branch-expand-btn {
      color: var(--blue-color);
      cursor: pointer;
    }
  }
}

@media (hover: hover) {
  .entry-page__comment {
    & .branch-collapse-btn {
      &:hover {
        border-left: 2px solid #4683d9;

        & ~ .entry-page__comment_reply {
          &::before {
            border: solid #4683d9;
            border-width: 0 0 2px 2px;
          }
        }
      }
    }

    & .branch-expand-btn {
      &:hover {
        color: var(--red-color);
      }
    }
  }
}
</style>