import { createStore } from "vuex";
import AuthModule from "./modules/Auth";
import FeedModule from "./modules/FeedPage";
import EntryPageModule from "./modules/EntryPage";
import ProfilePageModule from "./modules/ProfilePage";
import NotificationsModule from "./modules/Notifications";
import io from "socket.io-client";
import createWebSocketPlugin from "./plugins/createWebSocketPlugin";

let socket = io("https://ws-sio.tjournal.ru", {
  transports: ["websocket"],
});

const plugin = createWebSocketPlugin(socket);

export default createStore({
  modules: {
    auth: AuthModule,
    feed: FeedModule,
    entry: EntryPageModule,
    profile: ProfilePageModule,
    notifications: NotificationsModule,
  },

  mutations: {
    connectApiChannel() {},
    disconnectApiChannel() {},
    closeStartScreen() {},
  },

  plugins: [plugin],
});
