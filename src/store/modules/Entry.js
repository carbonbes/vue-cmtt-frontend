import { API_v2 } from "../../api/API_v2";
import { entryRatingInstance } from "../../api/config";

const entryModule = {
  state: () => ({
    entry: [],
    subsiteData: [],
    likesList: null,
  }),

  getters: {
    entry(state) {
      return state.entry;
    },

    subsiteData(state) {
      return state.subsiteData;
    },

    likesList(state) {
      return state.likesList;
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

    setLikesList(state, data) {
      state.likesList = data;
    },

    clearLikesList(state) {
      state.likesList = [];
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

    requestLikesList({ commit }, id) {
      return entryRatingInstance
        .get(`vote/get_likers?id=${id}&type=1`)
        .then((response) => {
          commit("setLikesList", response.data.data.likers);
        });
    },
  },
};

export default entryModule;
