import { API_v2 } from "../../api/API_v2";
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
      state.profileEntries.push(...data.map((entry) => entry.data));
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
          if (store.state.auth.auth.id === data.subsite_id) {
            entry.likes.isLiked = data.state;
          }
        }
      });
    },

    setEntryIsLiked(state, data) {
      state.profileEntries.find((entry) => {
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
  },

  actions: {
    requestProfile({ commit }, data) {
      return API_v2.subsite(data.id).then((response) => {
        commit("setProfile", response.data.result);
        commit("setProfileHidden", false);
      });
    },

    requestProfileEntries({ commit, state }, data) {
      return API_v2.getTimeline(data).then((response) => {
        if (!state.profileHidden) {
          commit("setProfileEntries", response.data.result.items);
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
