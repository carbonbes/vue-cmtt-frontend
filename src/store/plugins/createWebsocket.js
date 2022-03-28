export default function createWebSocket(socket) {
  return (store) => {
    socket.on("data", (data) => {
      store.commit("receiveData", data);
    });

    store.subscribe((mutation) => {
      if (mutation.type === "subscribe") {
        socket.emit("subscribe", mutation.payload);
      }
    });
  };
}
