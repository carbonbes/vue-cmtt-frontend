import { API_v2 } from "../../api/API_v2";

const feedModule = {
  state: () => ({
    feed: [],
    lastId: null,
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
  },
  mutations: {
    setFeed(state, data) {
      state.feed = data;
    },

    setLastId(state, id) {
      state.lastId = id;
    },

    clearFeed(state) {
      state.feed = [];
    },
  },
  actions: {
    requestFeed({ commit }, data) {
      return API_v2.getTimeline(data).then((response) => {
        commit("setFeed", response.data.result.items);
        commit("setLastId", response.data.result.lastId);
      });
    },
  },
};

export default feedModule;
