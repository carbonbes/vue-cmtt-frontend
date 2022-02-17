import { API_v2 } from "../../api/API_v2";

const feedModule = {
  state: () => ({
    feed: [],
    lastId: null,
    feedIsRequested: false,
  }),

  getters: {
    feed(state) {
      return state.feed
        .filter((entry) => entry.type === "entry")
        .map((entry) => entry.data);
    },

    lastId(state) {
      return state.lastId;
    },

    feedIsRequested(state) {
      return state.feedIsRequested;
    },
  },

  mutations: {
    setFeed(state, data) {
      state.feed.push(...data);
    },

    setLastId(state, id) {
      state.lastId = id;
    },

    setFeedIsRequested(state, value) {
      state.feedIsRequested = value;
    },

    clearFeed(state) {
      state.feed = [];
      state.lastId = null;
    },
  },

  actions: {
    requestFeed({ commit }, data) {
      commit("setFeedIsRequested", true);

      return API_v2.getTimeline(data).then((response) => {
        if (data.prevSorting !== data.sorting && !data.nextPage) {
          commit("clearFeed");
        }
        commit("setFeed", response.data.result.items);
        commit("setLastId", response.data.result.lastId);
        commit("setFeedIsRequested", false);
      });
    },
  },
};

export default feedModule;
