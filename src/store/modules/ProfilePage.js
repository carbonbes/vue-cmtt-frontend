import { API_v2 } from "../../api/API_v2";
import store from "../index";
import { notify } from "@kyvg/vue3-notification";

const profilePageModule = {
  state: () => ({
    profile: null,
    profileHidden: null,
    profileEntries: [],
    profileEntriesLastId: null,
    profileEntriesLastSortingValue: null,
    profileEntriesIsRequested: false,
    profileComments: [],
    profileCommentsLastId: null,
    profileCommentsLastSortingValue: null,
    profileCommentsIsRequested: false,
  }),

  getters: {
    profile(state) {
      return state.profile;
    },

    profileEntries(state) {
      return state.profileEntries;
    },

    profileEntriesCount(state) {
      return state.profile.counters.entries;
    },

    profileEntriesLastId(state) {
      return state.profileEntriesLastId;
    },

    profileEntriesLastSortingValue(state) {
      return state.profileEntriesLastSortingValue;
    },

    profileEntriesIsRequested(state) {
      return state.profileEntriesIsRequested;
    },

    profileComments(state) {
      return state.profileComments;
    },

    profileECommentsCount(state) {
      return state.profile.counters.comments;
    },

    profileCommentsLastId(state) {
      return state.profileCommentsLastId;
    },

    profileCommentsLastSortingValue(state) {
      return state.profileCommentsLastSortingValue;
    },

    profileCommentsIsRequested(state) {
      return state.profileCommentsIsRequested;
    },
  },

  mutations: {
    setProfile(state, data) {
      state.profile = data;
    },

    setProfileHidden(state, value) {
      state.profileHidden = value;
    },

    setProfileEntries(state, data) {
      state.profileEntries.push(...data);
    },

    setProfileEntriesLastId(state, data) {
      state.profileEntriesLastId = data;
    },

    setProfileEntriesLastSortingValue(state, data) {
      state.profileEntriesLastSortingValue = data;
    },

    setProfileEntriesIsRequested(state, value) {
      state.profileEntriesIsRequested = value;
    },

    clearProfileEntries(state) {
      state.profileEntries = [];
    },

    setProfileComments(state, data) {
      state.profileComments.push(...data);
    },

    setProfileCommentsLastId(state, data) {
      state.profileCommentsLastId = data;
    },

    setProfileCommentsLastSortingValue(state, data) {
      state.profileCommentsLastSortingValue = data;
    },

    setProfileCommentsIsRequested(state, value) {
      state.profileCommentsIsRequested = value;
    },

    clearProfileComments(state) {
      state.profileComments = [];
    },

    apiChannelContentVoted(state, data) {
      state.profileEntries.find((entry) => {
        if (entry.id === data.id) {
          entry.likes.summ = data.count;
          entry.likes.newLikes = true;
        }
      });
    },

    setProfileArticleLikesList(state, data) {
      state.profileEntries.find((entry) => {
        if (entry.id === data.id) {
          entry.likes.likesList = data.data;
          entry.likes.newLikes = false;
        }
      });
    },

    setProfileEntryIsLiked(state, data) {
      state.profileEntries.find((entry) => {
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
  },

  actions: {
    requestProfile({ commit }, data) {
      return API_v2.subsite(data.id).then((response) => {
        commit("setProfile", response.data.result);
        commit("setProfileHidden", false);
      });
    },

    requestProfileEntries({ commit, state }, data) {
      return API_v2.getTimeline(data.params).then((response) => {
        if (!state.profileHidden) {
          let items = response.data.result.items
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
          if (data.clearEntries) {
            commit("clearProfileEntries");
          }
          commit("setProfileEntries", items);
          commit("setProfileEntriesLastId", response.data.result.lastId);
          commit(
            "setProfileEntriesLastSortingValue",
            response.data.result.lastSortingValue
          );
        }
      });
    },

    requestProfileComments({ commit, state }, data) {
      return API_v2.getComments(data).then((response) => {
        if (!state.profileHidden) {
          if (data.clearComments) {
            commit("clearProfileComments");
          }
          commit("setProfileComments", response.data.result.items);
          commit("setProfileCommentsLastId", response.data.result.lastId);
          commit(
            "setProfileCommentsLastSortingValue",
            response.data.result.lastSortingValue
          );
        }
      });
    },
  },
};

export default profilePageModule;
