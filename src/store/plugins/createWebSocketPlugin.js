export default function createWebSocketPlugin(socket) {
  return (store) => {
    store.subscribe((mutation) => {
      if (mutation.type === "connectApiChannel") {
        socket.emit("subscribe", {
          channel: "api",
        });
      }

      if (mutation.type === "disconnectApiChannel") {
        socket.emit("unsubscribe", {
          channel: "api",
        });
      }

      if (mutation.type === "setIsAuth" && mutation.payload === true) {
        const userHash = localStorage.getItem("user_hash");

        socket.emit("subscribe", { channel: "mobile:" + userHash });
      }

      if (mutation.type === "setIsAuth" && mutation.payload === false) {
        const userHash = localStorage.getItem("user_hash");

        socket.emit("unsubscribe", { channel: "mobile:" + userHash });
      }

      if (mutation.type === "connectEntryPageChannel") {
        socket.emit("subscribe", {
          channel: "api:comments-" + mutation.payload,
        });
      }

      if (mutation.type === "disconnectEntryPageChannel") {
        socket.emit("unsubscribe", {
          channel: "api:comments-" + mutation.payload,
        });
      }
    });

    socket.on("event", (data) => {
      if (data.data.type === "content voted") {
        if (store.state.auth.auth.id !== data.data.subsite_id) {
          store.commit("apiChannelContentVoted", data.data);
        }
      }

      /* if (data.data.type === "new_entry_published") {
        store.commit("apiChannelNewEntry", data.data);
      } */

      if (
        data.data.type === 4 ||
        data.data.type === 8 ||
        data.data.type === 16 ||
        data.data.type === 32 ||
        data.data.type === 64
      ) {
        store.commit("setUnreadNotifications");
      }

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
  };
}
