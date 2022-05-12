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

    setEntryIsLiked(state, data) {
      state.feed.find((entry) => {
        if (entry.id === data.id) {
          let sign = data.sign;
          let summ = entry.likes.summ;

          if (data.reset) {
            entry.likes.isLiked = entry.likes.prevIsLiked;

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
            entry.likes.summ =
              sign === -1 && entry.likes.isLiked === 0
                ? --entry.likes.summ
                : sign === -1 && entry.likes.isLiked === 1
                ? entry.likes.summ - 2
                : sign === 0 && entry.likes.isLiked === -1
                ? ++entry.likes.summ
                : sign === 0 && entry.likes.isLiked === 1
                ? --entry.likes.summ
                : sign === 1 && entry.likes.isLiked === 0
                ? ++entry.likes.summ
                : sign === 1 && entry.likes.isLiked === -1
                ? entry.likes.summ + 2
                : null;

            entry.likes.isLiked = data.sign;
            entry.likes.newLikes = true;
          }
        }
      });
    },

    apiChannelContentVoted(state, data) {
      state.feed.find((entry) => {
        if (entry.id === data.id) {
          entry.likes.summ = data.count;
          entry.likes.newLikes = true;
        }
      });
    },

    setEntryLikesList(state, data) {
      if (data.type === "feedEntry") {
        state.feed.find((entry) => {
          if (entry.id === data.id) {
            entry.likes.likesList = data.data;
            entry.likes.newLikes = false;
          }
        });
      }
    },
  },

  actions: {
    requestFeed({ commit }, data) {
      commit("setFeedIsRequested", true);

      return API_v2.getTimeline(data).then((response) => {
        let items = response.data.result.items
          .filter((entry) => entry.type === "entry")
          .map((entry) => entry.data)
          .map((item) => {
            item.likes.prevIsLiked = null;
            item.likes.prevIsLiked = item.likes.isLiked;
            item.likes.likesList = null;
            item.likes.likesList = [];
            item.likes.newLikes = null;
            item.likes.newLikes = false;

            return item;
          });

        if (
          (data.prevSorting !== data.sorting ||
            data.prevAllSite !== data.allSite) &&
          !data.nextPage
        ) {
          commit("clearFeed");
        }
        commit("setFeed", items);
        commit("setLastId", response.data.result.lastId);
        commit("setFeedIsRequested", false);
      });
    },
  },
};

export default feedPageModule;
