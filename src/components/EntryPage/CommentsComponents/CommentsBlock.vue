<template>
  <template v-for="comment in props.comments" :key="comment.id">
    <comment-block
      :comment="comment"
      :maxLvl="state.maxLvl"
      v-if="comment.isIgnored !== true || comment.isRemoved !== true"
    />
  </template>
</template>

<script setup>
import { reactive, watch, onMounted, onUnmounted } from "vue";
import store from "@/store";
import { useMediaQuery } from "@vueuse/core";
import CommentBlock from "@/components/EntryPage/CommentsComponents/CommentBlock.vue";
import io from "socket.io-client";

let socket = io("https://ws-sio.tjournal.ru", {
  transports: ["websocket"],
});

const props = defineProps({ comments: Array });

const isMobile = useMediaQuery("(max-width: 768px)");

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
    } else {
      state.maxLvl = 8;
    }
  }
);

onMounted(() => {
  socket.emit("subscribe", {
    channel: `api:comments-${store.state.entry.entry.id}`,
  });

  socket.on("event", (data) => {
    if (data.data.type === "comment voted") {
      if (store.state.auth.auth.id !== data.data.subsite_id) {
        store.commit("entryCommentsChannelVoted", data.data);
      }
    }

    if (data.data.type === "comment_created") {
      if (store.state.auth.auth.id !== data.data.comment.author.id) {
        store.commit("entryCommentsChannelCreated", data.data);
      }
    }

    if (data.data.type === "comment_edited") {
      store.commit("entryCommentsChannelEdited", data.data);
    }
  });

  socket.on("reconnect", () => {
    socket.emit("subscribe", {
      channel: `api:comments-${store.state.entry.entry.id}`,
    });
  });
});

onUnmounted(() => {
  socket.disconnect();
});
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