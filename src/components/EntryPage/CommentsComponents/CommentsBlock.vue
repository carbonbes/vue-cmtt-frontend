<template>
  <template v-for="comment in comments" :key="comment.id">
    <comment-block :comment="comment" v-if="!comment.isIgnored" />
  </template>
</template>

<script>
import { onMounted, onUnmounted } from "vue";
import CommentBlock from "@/components/EntryPage/CommentsComponents/CommentBlock.vue";
import io from "socket.io-client";
import store from "@/store";

export default {
  setup() {
    let socket = io("https://ws-sio.tjournal.ru", {
      transports: ["websocket"],
    });

    onMounted(() => {
      socket.emit("subscribe", {
        channel: `api:comments-${store.state.entry.entry.id}`,
      });

      socket.on("event", (data) => {
        if (data.data.type === "comment voted") {
          store.commit("entryCommentsChannelVoted", data.data);
        }

        if (data.data.type === "comment_created") {
          store.commit("entryCommentsChannelCreated", data.data);
        }

        if (data.data.type === "comment_edited") {
          store.commit("entryCommentsChannelEdited", data.data);
        }
      });
    });

    onUnmounted(() => {
      socket.disconnect();
    });
  },

  props: {
    comments: Array,
  },

  components: { CommentBlock },
};
</script>