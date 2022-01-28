import { createStore } from "vuex";
import Auth from "./modules/Auth";
import Feed from "./modules/Feed";
import Entry from "./modules/Entry";

export default createStore({
  modules: {
    auth: Auth,
    feed: Feed,
    entry: Entry,
  },
});
