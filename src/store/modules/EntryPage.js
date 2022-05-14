import { API_v1 } from "../../api/API_v1";
import { API_v2 } from "../../api/API_v2";
import { entryRatingInstance, entryRepostsInstance } from "../../api/config";
import { notify } from "@kyvg/vue3-notification";

const entryPageModule = {
  state: () => ({
    entry: [],
    entryPrevLiked: null,
    subsiteData: [],
    repostsList: null,
    commentsList: null,
    unreadComments: null,
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

    repostsList(state) {
      return state.repostsList;
    },

    commentsList(state) {
      return state.commentsList;
    },

    unreadComments(state) {
      return state.unreadComments;
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

    setEntryLikesList(state, data) {
      if (data.type === "entryPage") {
        state.entry.likes.likesList = data.data;
        state.entry.likes.newLikes = false;
      }
    },

    setCommentLikesList(state, data) {
      state.commentsList.find((comment) => {
        if (comment.id == data.commentId) {
          comment.likes.likesList = data.data;
          comment.likes.newLikes = false;
        }
      });
    },

    setRepostsList(state, data) {
      state.repostsList = data;
    },

    setCommentsList(state, data) {
      state.commentsList = data;
    },

    setUnreadComments(state, data) {
      state.unreadComments = data;
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

    setEntryPrevLiked(state, value) {
      state.entryPrevLiked = value;
    },

    setEntryIsLiked(state, data) {
      if (state.entry.id === data.id) {
        let sign = data.sign;
        let summ = state.entry.likes.summ;

        if (data.reset) {
          state.entry.likes.isLiked = state.entryPrevLiked;

          state.entry.likes.summ =
            sign === -1 && (summ <= 0 || summ >= 0)
              ? ++state.entry.likes.summ
              : sign === 0 && summ <= 0
              ? --state.entry.likes.summ
              : sign === 0 && summ >= 0
              ? ++state.entry.likes.summ
              : sign === 1 && (summ <= 0 || summ >= 0)
              ? --state.entry.likes.summ
              : null;
        } else {
          state.entry.likes.summ =
            sign === -1 && state.entry.likes.isLiked === 0
              ? --state.entry.likes.summ
              : sign === -1 && state.entry.likes.isLiked === 1
              ? state.entry.likes.summ - 2
              : sign === 0 && state.entry.likes.isLiked === -1
              ? ++state.entry.likes.summ
              : sign === 0 && state.entry.likes.isLiked === 1
              ? --state.entry.likes.summ
              : sign === 1 && state.entry.likes.isLiked === 0
              ? ++state.entry.likes.summ
              : sign === 1 && state.entry.likes.isLiked === -1
              ? state.entry.likes.summ + 2
              : null;

          state.entry.likes.isLiked = data.sign;
          state.entry.likes.newLikes = true;
        }
      }
    },

    setCommentIsLiked(state, data) {
      state.commentsList.find((comment) => {
        if (comment.id == data.id) {
          let sign = data.sign;
          let summ = comment.likes.summ;

          if (data.reset) {
            comment.likes.isLiked = comment.likes.prevIsLiked;

            comment.likes.summ =
              sign === -1 && (summ <= 0 || summ >= 0)
                ? ++comment.likes.summ
                : sign === 0 && summ <= 0
                ? --comment.likes.summ
                : sign === 0 && summ >= 0
                ? ++comment.likes.summ
                : sign === 1 && (summ <= 0 || summ >= 0)
                ? --comment.likes.summ
                : null;
          } else {
            comment.likes.summ =
              sign === -1 && comment.likes.isLiked === 0
                ? --comment.likes.summ
                : sign === -1 && comment.likes.isLiked === 1
                ? comment.likes.summ - 2
                : sign === 0 && comment.likes.isLiked === -1
                ? ++comment.likes.summ
                : sign === 0 && comment.likes.isLiked === 1
                ? --comment.likes.summ
                : sign === 1 && comment.likes.isLiked === 0
                ? ++comment.likes.summ
                : sign === 1 && comment.likes.isLiked === -1
                ? comment.likes.summ + 2
                : null;

            comment.likes.isLiked = data.sign;
            comment.likes.newLikes = true;
          }
        }
      });
    },

    apiChannelContentVoted(state, data) {
      if (state.entry.id === data.id) {
        state.entry.likes.summ = data.count;
        state.entry.likes.newLikes = true;
      }
    },

    entryCommentsChannelVoted(state, data) {
      state.commentsList.find((comment) => {
        if (comment.id === data.id) {
          comment.likes.summ = data.count;
          comment.likes.newLikes = true;
        }
      });
    },

    entryCommentsChannelCreated(state, data) {
      let newComment = data.comment;
      newComment.etcControls = null;
      newComment.likes.prevIsLiked = null;
      newComment.likes.prevIsLiked = data.comment.likes.is_liked;
      newComment.likes.isLiked = null;
      newComment.likes.isLiked = data.comment.likes.is_liked;
      newComment.likes.likesList = null;
      newComment.likes.likesList = [];
      newComment.likes.newLikes = null;
      newComment.likes.newLikes = false;
      newComment.isIgnore = null;
      newComment.isIgnored = data.comment.is_ignored;
      newComment.isRemoved = null;
      newComment.isRemoved = data.comment.is_removed;
      newComment.media = [...data.comment.attaches];

      state.commentsList.push(newComment);
    },

    entryCommentsChannelEdited(state, data) {
      state.commentsList.find((comment) => {
        if (comment.id === data.comment.id) {
          comment.isEdited = data.comment.isEdited;
          comment.text = data.comment.text;
          comment.media = [...data.comment.attaches];
        }
      });
    },

    addComment(state, data) {
      let newComment = data.comment;
      newComment.replies = null;
      newComment.replies = [];
      newComment.etcControls = null;
      newComment.likes.prevIsLiked = data.comment.likes.is_liked;
      newComment.likes.isLiked = null;
      newComment.likes.isLiked = data.comment.likes.is_liked;
      newComment.likes.likesList = null;
      newComment.likes.likesList = [];
      newComment.likes.newLikes = null;
      newComment.isIgnored = null;
      newComment.isIgnored = data.comment.is_ignored;
      newComment.isRemoved = null;
      newComment.isRemoved = data.comment.is_removed;
      newComment.media = [...data.comment.attaches];

      if (data.position === "top") {
        state.commentsList.unshift(newComment);
      } else if (data.position === "bottom") {
        state.commentsList.push(newComment);
      } else if (!data.position) {
        state.commentsList.unshift(newComment);
      }
    },

    setCommentEtcControls(state, data) {
      state.commentsList.find((comment) => {
        if (comment.id === data.id) {
          comment.etcControls = data.controls;
        }
      });
    },
  },

  actions: {
    requestEntry({ commit }, id) {
      return API_v2.getEntry(id).then((response) => {
        let entry = response.data.result;
        entry.likes.likesList = null;
        entry.likes.likesList = [];
        entry.likes.newLikes = null;
        entry.likes.newLikes = false;

        commit("setEntry", entry);
      });
    },

    requestSubsiteData({ commit }, id) {
      return API_v2.subsite(id).then((response) => {
        commit("setSubsiteData", response.data.result);
      });
    },

    postEntryLike({ commit }, data) {
      commit("setEntryIsLiked", data);

      return API_v1.postLike(data).catch((error) => {
        commit("setEntryIsLiked", {
          id: data.id,
          content: data.content,
          sign: data.sign,
          reset: true,
        });

        notify({
          title: "Ошибка " + error.response.data.error.code,
          text: error.response.data.message,
        });
      });
    },

    postCommentLike({ commit }, data) {
      commit("setCommentIsLiked", data);

      return API_v1.postLike(data).catch((error) => {
        commit("setCommentIsLiked", {
          id: data.id,
          content: data.content,
          sign: data.sign,
          reset: true,
        });

        notify({
          title: "Ошибка " + error.response.data.error.code,
          text: error.response.data.message,
        });
      });
    },

    requestLikesList({ commit }, data) {
      if (data.type === "entry") {
        return entryRatingInstance
          .get(`vote/get_likers?id=${data.id}&type=1`)
          .then((response) => {
            if (data.subtype === "entryPage") {
              commit("setEntryLikesList", {
                type: "entryPage",
                data: response.data.data.likers,
              });
            } else if (data.subtype === "feedEntry") {
              commit("setEntryLikesList", {
                id: data.id,
                type: "feedEntry",
                data: response.data.data.likers,
              });
            } else if (data.subtype === "profileEntry") {
              console.log("yes");
              commit("setEntryLikesList", {
                id: data.id,
                type: "profileEntry",
                data: response.data.data.likers,
              });
            }
          });
      } else if (data.type === "comment") {
        return API_v1.getCommentLikes(data.id).then((response) => {
          commit("setCommentLikesList", {
            commentId: data.id,
            data: response.data.result,
          });
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
        let items = response.data.result.items.map((item) => {
          item.etcControls = null;
          item.likes.prevIsLiked = null;
          item.likes.prevIsLiked = item.likes.isLiked;
          item.likes.likesList = null;
          item.likes.likesList = [];
          item.likes.newLikes = null;
          item.likes.newLikes = false;

          return item;
        });
        commit("setCommentsList", items);
      });
    },

    postComment({}, data) {
      return API_v1.postComment(data);
    },

    editComment({}, data) {
      return API_v1.editComment(data);
    },

    uploadFile({}, file) {
      return API_v1.uploadFile(file);
    },

    requestCommentEtcControls({ commit }, id) {
      return API_v2.getCommentEtcControls(id).then((response) => {
        commit("setCommentEtcControls", {
          id,
          controls: response.data.result.etcControls,
        });
      });
    },
  },
};

export default entryPageModule;
