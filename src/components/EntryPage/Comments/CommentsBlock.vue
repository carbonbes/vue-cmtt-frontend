<script setup>
import { reactive, watch } from "vue";
import { useStore } from "vuex";
import { useMediaQuery } from "@vueuse/core";
import CommentBlock from "@/components/EntryPage/Comments/CommentBlock.vue";

const isMobile = useMediaQuery("(max-width: 768px)");
const store = useStore();

// props
const props = defineProps(["comments"]);

// state
const state = reactive({
  maxLvl: 8,
  idCommentBranchFocused: 0,
});

// methods
const setIdCommentBranchFocused = (commentId) => {
  state.idCommentBranchFocused = commentId;
};

// watch
watch(
  () => isMobile.value,
  () => {
    if (isMobile.value) {
      state.maxLvl = 4;
    } else if (!isMobile.value) {
      state.maxLvl = 8;
    }
  }
);
</script>

<template>
  <template v-for="comment in props.comments" :key="comment.id">
    <CommentBlock
      :comment="comment"
      :maxLvl="state.maxLvl"
      :idCommentBranchFocused="state.idCommentBranchFocused"
      :setIdCommentBranchFocused="setIdCommentBranchFocused"
    />
  </template>
</template>

<style lang="scss">
.entry-page__comment {
  .comment-content {
    .reply-form {
      margin-top: 12px;
      margin-bottom: 18px;
    }
  }
}
</style>