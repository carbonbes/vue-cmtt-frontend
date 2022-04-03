import { API_v1 } from "../../api/API_v1";
import { API_v2 } from "../../api/API_v2";
import { entryRatingInstance, entryRepostsInstance } from "../../api/config";

const entryModule = {
  state: () => ({
    entry: [],
    subsiteData: [],
    entrylikesList: null,
    repostsList: null,
    commentsList: null,
    hoveredHighlightComment: null,
    temporaryHightlightComment: null,
  }),

  getters: {
    entry(state) {
      return state.entry;
    },

    entryId(state) {
      return state.entry.id;
    },

    entryAuthorId(state) {
      return state.entry.author.id;
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

    hoveredHighlightComment(state) {
      return state.hoveredHighlightComment;
    },

    temporaryHightlightComment(state) {
      return state.temporaryHightlightComment;
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

    setHoveredHighlightComment(state, id) {
      state.hoveredHighlightComment = id;
    },

    clearHoveredHighlightComment(state) {
      state.hoveredHighlightComment = null;
    },

    setTemporaryHightlightComment(state, id) {
      state.temporaryHightlightComment = id;
    },

    clearTemporaryHightlightComment(state) {
      state.temporaryHightlightComment = null;
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

    requestLikesList({ commit }, data) {
      if (data.type === "entry") {
        return entryRatingInstance
          .get(`vote/get_likers?id=${data.id}&type=1`)
          .then((response) => {
            commit("setLikesList", response.data.data.likers);
          });
      } else if (data.type === "comment") {
        return API_v1.getCommentLikes(data.id).then((response) => {
          commit("setLikesList", response.data.result);
        });
      }
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
