import Api from "@/api";

const feedPageModule = {
  state: () => ({
    feed: [],
    lastId: null,
    lastSortingValue: null,
    feedIsRequested: false,
    shortNews: [],
    shortNewsLastId: null,
    newArticlesCount: 0,
  }),

  getters: {
    feed(state) {
      return state.feed;
    },

    lastId(state) {
      return state.lastId;
    },

    lastSortingValue(state) {
      return state.lastSortingValue;
    },

    feedIsRequested(state) {
      return state.feedIsRequested;
    },

    shortNews(state) {
      return state.shortNews;
    },

    shortNewsLastId(state) {
      return state.shortNewsLastId;
    },

    newArticlesCount(state) {
      return state.newArticlesCount;
    },
  },

  mutations: {
    setFeed(state, data) {
      state.feed.push(...data);
    },

    setLastId(state, id) {
      state.lastId = id;
    },

    setLastSortingValue(state, lastSortingValue) {
      state.lastSortingValue = lastSortingValue;
    },

    setFeedIsRequested(state, value) {
      state.feedIsRequested = value;
    },

    clearFeed(state) {
      state.feed = [];
      state.lastId = null;
    },

    setFeedEntryIsLiked(state, data) {
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

    apiChannelNewEntry(state) {
      state.newArticlesCount = ++state.newArticlesCount;
    },

    setFeedArticleLikesList(state, data) {
      state.feed.find((entry) => {
        if (entry.id === data.id) {
          entry.likes.likesList = data.data;
          entry.likes.newLikes = false;
        }
      });
    },

    setShortNews(state, data) {
      state.shortNews.push(...data);
    },

    setShortNewsLastId(state, lastId) {
      state.shortNewsLastId = lastId;
    },

    clearShortNews(state) {
      state.shortNews = [];
    },

    clearCountNewArticles(state) {
      state.newArticlesCount = 0;
    },
  },

  actions: {
    requestFeed({ commit }, data) {
      commit("setFeedIsRequested", true);

      return Api.requestFeed(data.params).then((response) => {
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

        if (data.clear && !data.nextPage) {
          commit("clearFeed");
        }
        commit("setFeed", items);
        commit("setLastId", response.data.result.lastId);
        commit("setLastSortingValue", response.data.result.lastSortingValue);
        commit("setFeedIsRequested", false);
      });
    },

    requestShortNews({ commit }, data) {
      return Api.requestDigest(data).then((response) => {
        commit("setShortNews", response.data.result.news);
        commit("setShortNewsLastId", response.data.result.lastId);
      });
    },
  },
};

export default feedPageModule;
