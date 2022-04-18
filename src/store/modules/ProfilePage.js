import { API_v2 } from "../../api/API_v2";
import { notify } from "@kyvg/vue3-notification";

const profilePageModule = {
  state: () => ({
    profile: null,
    profileHidden: null,
    profileEntries: [],
    profileEntriesIsRequested: false,
  }),

  getters: {
    profile(state) {
      return state.profile;
    },

    profileEntries(state) {
      return state.profileEntries;
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
  },
};

export default profilePageModule;
