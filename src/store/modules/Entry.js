import { API_v2 } from "../../api/API_v2";

const entryModule = {
  state: () => ({
    entry: [],
    subsiteData: [],
  }),

  getters: {
    entry(state) {
      return state.entry;
    },

    subsiteData(state) {
      return state.subsiteData;
    },
  },

  mutations: {
    setEntry(state, data) {
      state.entry = data;
    },

    clearEntry(state) {
      state.entry = [];
    },

    setSubsiteData(state, data) {
      state.subsiteData = data;
    },

    clearSubsiteData(state) {
      state.subsiteData = [];
    },
  },

  actions: {
    requestEntry({ commit }, id) {
      return API_v2.getEntry(id).then((response) => {
        commit("setEntry", response.data.result);
      });
    },

    requestSubsiteData({ commit }, id) {
      return API_v2.subsite(id).then((response) => {
        commit("setSubsiteData", response.data.result);
      });
    },
  },
};

export default entryModule;
