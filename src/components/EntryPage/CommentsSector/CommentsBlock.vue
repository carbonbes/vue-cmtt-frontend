<script setup>
import { computed, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useMediaQuery } from "@vueuse/core";
import CommentBlock from "./CommentBlock.vue";

const isMobile = useMediaQuery("(max-width: 768px)");
const store = useStore();

// props
const props = defineProps(["comments"]);

// state
const state = reactive({
  maxLvl: 8,
});

// computed
const ignoredSubsites = computed(() => {
  const ignoredProfiles = JSON.parse(localStorage.getItem("ignoredProfiles"));

  if (!ignoredProfiles) {
    return [];
  } else return ignoredProfiles;
});

// watch
watch(
  () => isMobile.value,
  () => {
    if (isMobile.value) {
      state.maxLvl = 5;
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
      v-if="
        !ignoredSubsites.some((subsite) => subsite.id === comment.author.id)
      "
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