<template>
  <template v-for="comment in props.comments" :key="comment.id">
    <comment-block :comment="comment" :maxLvl="state.maxLvl" />
  </template>
</template>

<script setup>
import { reactive, watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import CommentBlock from "@/components/EntryPage/Comments/CommentBlock.vue";

const isMobile = useMediaQuery("(max-width: 768px)");

// props
const props = defineProps({ comments: Array });

// state
const state = reactive({
  maxLvl: 8,
});

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

<style lang="scss">
.entry-page__comment {
  & .comment-content {
    & .reply-form {
      margin-top: 12px;
      margin-bottom: 18px;
    }
  }
}
</style>