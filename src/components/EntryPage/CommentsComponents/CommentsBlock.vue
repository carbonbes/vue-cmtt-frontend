<template>
  <template v-for="comment in comments" :key="comment.id">
    <comment-block :comment="comment" :queryCommentId="queryCommentId" />
  </template>
</template>

<script>
import CommentBlock from "@/components/EntryPage/CommentsComponents/CommentBlock.vue";

export default {
  props: {
    comments: Array,
  },

  components: { CommentBlock },

  computed: {
    queryCommentId() {
      return this.$route.query.comment;
    },
  },
};
</script>