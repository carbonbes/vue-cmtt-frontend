<template>
  <div class="entry-page__comment">
    <div class="entry-page__parent-comment">
      <div class="entry-page__comment-self">
        <div class="content">
          <div class="content__text" v-html="commentText"></div>
        </div>
      </div>
    </div>
    <div class="entry-page__child-comments">
      <div
        class="branch-collapse-btn"
        :class="branchCollapseBtnClassObj"
        title="Свернуть эту ветку"
        @click="toggleBranchCollapse"
      />
      <div
        class="branch-expand-btn"
        v-if="branchIsCollapsed"
        @click="toggleBranchCollapse"
      >
        Развернуть
      </div>
      <div
        class="entry-page__child-comment"
        :class="childCommentClassObj"
        v-if="this.comment.replies.length > 0"
      >
        <comment-block
          v-for="comment in this.comment.replies"
          :comment="comment"
          :key="comment.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "comment-block",

  props: {
    comment: Object,
  },

  data() {
    return {
      branchIsCollapsed: false,
    };
  },

  computed: {
    commentText() {
      return this.comment.text;
    },

    childCommentClassObj() {
      return {
        "entry-page__child-comment_collapsed": this.branchIsCollapsed,
      };
    },

    branchCollapseBtnClassObj() {
      return {
        "branch-collapse-btn_hidden": this.branchIsCollapsed,
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
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }

  &__parent-comment {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  &__comment-self {
    & .content {
      padding-right: 85px;
    }
  }

  &__child-comments {
    position: relative;

    & .branch-collapse-btn {
      position: absolute;
      left: 0;
      width: 25px;
      height: 100%;
      box-shadow: inset 1px 0 0 #e6e6e6;

      &_hidden {
        display: none;
      }
    }

    & .branch-expand-btn {
      color: var(--blue-color);
    }
  }

  &__child-comment {
    padding-left: 25px;

    &_collapsed {
      display: none;
    }
  }
}
</style>