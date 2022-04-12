import { API_v2 } from "../../api/API_v2";
import store from "../index";

const feedPageModule = {
  state: () => ({
    feed: [],
    lastId: null,
    feedIsRequested: false,
  }),

  getters: {
    feed(state) {
      return state.feed;
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
      state.feed.push(
        ...data
          .filter((entry) => entry.type === "entry")
          .map((entry) => entry.data)
      );
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

    setEntryIsLiked(state, data) {
      state.feed.find((entry) => {
        if (entry.id === data.id) {
          let sign = data.sign;
          let summ = entry.likes.summ;

          if (data.reset) {
            entry.likes.isLiked =
              entry.likes.isLiked === -1 && (data.sign === 0 || data.sign === 1)
                ? -1
                : entry.likes.isLiked === 0 &&
                  (data.sign === -1 || data.sign === 1)
                ? 0
                : entry.likes.isLiked === 1 &&
                  (data.sign === -1 || data.sign === 0)
                ? 1
                : null;
            entry.likes.summ =
              sign === 1 && (summ <= 0 || summ >= 0)
                ? --entry.likes.summ
                : sign === 0 && summ <= 0
                ? ++entry.likes.summ
                : sign === 0 && summ >= 0
                ? --entry.likes.summ
                : sign === -1 && (summ <= 0 || summ >= 0)
                ? ++entry.likes.summ
                : null;
          } else {
            entry.likes.isLiked = data.sign;
            entry.likes.summ =
              sign === -1 && (summ <= 0 || summ >= 0)
                ? --entry.likes.summ
                : sign === 0 && summ <= 0
                ? ++entry.likes.summ
                : sign === 0 && summ >= 0
                ? --entry.likes.summ
                : sign === 1 && (summ <= 0 || summ >= 0)
                ? ++entry.likes.summ
                : null;
          }
        }
      });
    },

    apiChannelContentVoted(state, data) {
      state.feed.find((entry) => {
        if (entry.id === data.id) {
          entry.likes.summ = data.count;
          if (store.state.auth.auth.id === data.subsite_id) {
            entry.likes.isLiked = data.state;
          }
        }
      });
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

export default feedPageModule;
