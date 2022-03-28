<template>
  <template v-for="comment in comments" :key="comment.id">
    <comment-block :comment="comment" />
  </template>
</template>

<script>
import CommentBlock from "@/components/EntryPage/CommentsComponents/CommentBlock.vue";

export default {
  props: {
    comments: Array,
  },

  components: { CommentBlock },
};
</script>

<style lang="scss">
</style>