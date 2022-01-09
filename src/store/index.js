import { createStore } from "vuex";
import Feed from "./modules/Feed";
import Entry from "./modules/Entry";

export default createStore({
  modules: {
    feed: Feed,
    entry: Entry,
  },
});
