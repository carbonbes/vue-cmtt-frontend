import { API_v2 } from "../../api/API_v2";
import { notify } from "@kyvg/vue3-notification";

const profilePageModule = {
  state: () => ({
    profile: null,
    profileHidden: null,
    profileEntries: [],
    profileEntriesIsRequested: false,
    profileComments: [],
    profileCommentsIsRequested: false,
  }),

  getters: {
    profile(state) {
      return state.profile;
    },

    profileEntries(state) {
      return state.profileEntries;
    },

    profileComments(state) {
      return state.profileComments;
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

    clearProfileEntries(state) {
      state.profileEntries = [];
    },

    setProfileEntriesIsRequested(state, value) {
      state.profileEntriesIsRequested = value;
    },

    setProfileComments(state, data) {
      state.profileComments.push(...data);
    },

    clearProfileComments(state) {
      state.profileComments = [];
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
        }
      });
    },

    requestProfileComments({ commit, state }, data) {
      return API_v2.getComments(data).then((response) => {
        if (!state.profileHidden) {
          commit("setProfileComments", response.data.result.items);
        }
      });
    },
  },
};

export default profilePageModule;
