import { createStore } from "vuex";
import Auth from "./modules/Auth";
import Feed from "./modules/FeedPage";
import EntryPage from "./modules/EntryPage";
import profilePageModule from "./modules/ProfilePage";

export default createStore({
  modules: {
    auth: Auth,
    feed: Feed,
    entry: EntryPage,
    profile: profilePageModule,
  },
});
