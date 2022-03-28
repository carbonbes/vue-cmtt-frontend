import { API_v2 } from "../../api/API_v2";
import { entryRatingInstance, entryRepostsInstance } from "../../api/config";

const entryModule = {
  state: () => ({
    entry: [],
    subsiteData: [],
    likesList: null,
    repostsList: null,
    commentsList: null,
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

    repostsList(state) {
      return state.repostsList;
    },

    commentsList(state) {
      return state.commentsList;
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

    setRepostsList(state, data) {
      state.repostsList = data;
    },

    setCommentsList(state, data) {
      state.commentsList = data;
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

    requestRepostsList({ commit }, id) {
      return entryRepostsInstance
        .get(`reposts/getreposted?content_id=${id}`)
        .then((response) => {
          commit("setRepostsList", response.data.data.items);
        });
    },

    requestCommentsList({ commit }, data) {
      return API_v2.getComments(data).then((response) => {
        commit("setCommentsList", response.data.result.items);
      });
    },
  },
};

export default entryModule;
