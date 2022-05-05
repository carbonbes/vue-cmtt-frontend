import { createStore } from "vuex";
import AuthModule from "./modules/Auth";
import FeedModule from "./modules/FeedPage";
import EntryPageModule from "./modules/EntryPage";
import ProfilePageModule from "./modules/ProfilePage";
import NotificationsModule from "./modules/Notifications";

export default createStore({
  modules: {
    auth: AuthModule,
    feed: FeedModule,
    entry: EntryPageModule,
    profile: ProfilePageModule,
    notifications: NotificationsModule,
  },
});
