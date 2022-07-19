import Api from "@/api";
import { entryRatingInstance, entryRepostsInstance } from "../../api/config";
import { notify } from "@kyvg/vue3-notification";

const entryPageModule = {
  state: () => ({
    entry: null,
    subsiteData: null,
    repostsList: null,
    commentsList: null,
    temporaryHightlightComment: null,
    temporaryHightlightCommentTimeout: null,
    idEntryConnectedChannel: null,
  }),

  getters: {
    entry(state) {
      return state.entry;
    },

    entryId(state) {
      if (state.entry) return state.entry.id;
    },

    entryAuthorId(state) {
      if (state.entry) return state.entry.author.id;
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

    temporaryHightlightComment(state) {
      return state.temporaryHightlightComment;
    },

    idEntryConnectedChannel(state) {
      return state.idEntryConnectedChannel;
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

    setArticlePageLikesList(state, data) {
      state.entry.likes.likesList = data.data;
      state.entry.likes.newLikes = false;
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

    setTemporaryHightlightComment(state, id) {
      state.temporaryHightlightComment = id;

      this.temporaryHightlightCommentTimeout = setTimeout(() => {
        state.temporaryHightlightComment = null;
        clearTimeout(this.temporaryHightlightCommentTimeout);
      }, 3000);
    },

    setPageEntryIsLiked(state, data) {
      if (state.entry.id === data.id) {
        let sign = data.sign;
        let summ = state.entry.likes.summ;

        if (data.reset) {
          state.entry.likes.isLiked = state.entry.likes.prevIsLiked;

          state.entry.likes.summ =
            sign === -1 && (summ <= 0 || summ >= 0)
              ? ++summ
              : sign === 0 && summ <= 0
              ? --summ
              : sign === 0 && summ >= 0
              ? ++summ
              : sign === 1 && (summ <= 0 || summ >= 0)
              ? --summ
              : null;
        } else {
          state.entry.likes.summ =
            sign === -1 && state.entry.likes.isLiked === 0
              ? --summ
              : sign === -1 && state.entry.likes.isLiked === 1
              ? summ - 2
              : sign === 0 && state.entry.likes.isLiked === -1
              ? ++summ
              : sign === 0 && state.entry.likes.isLiked === 1
              ? --summ
              : sign === 1 && state.entry.likes.isLiked === 0
              ? ++summ
              : sign === 1 && state.entry.likes.isLiked === -1
              ? summ + 2
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
      if (state.entry && state.entry.id === data.id) {
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
      newComment.isIgnored = null;
      newComment.isIgnored = data.comment.is_ignored;
      newComment.isRemoved = null;
      newComment.isRemoved = data.comment.is_removed;
      newComment.media = [...data.comment.attaches];

      state.commentsList.push(newComment);
      state.entry.counters.comments = ++state.entry.counters.comments;
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
      state.entry.counters.comments = ++state.entry.counters.comments;
    },

    setCommentEtcControls(state, data) {
      state.commentsList.find((comment) => {
        if (comment.id === data.id) {
          comment.etcControls = data.controls;
        }
      });
    },

    setIdEntryConnectedChannel(state, id) {
      state.idEntryConnectedChannel = id;
    },

    connectEntryPageChannel() {},

    disconnectEntryPageChannel() {},
  },

  actions: {
    requestEntry({ commit }, id) {
      return Api.requestEntry(id).then((response) => {
        let entry = response.data.result;
        entry.likes.prevIsLiked = null;
        entry.likes.prevIsLiked = entry.likes.isLiked;
        entry.likes.likesList = null;
        entry.likes.likesList = [];
        entry.likes.newLikes = null;
        entry.likes.newLikes = false;

        commit("setEntry", entry);
      });
    },

    requestSubsiteData({ commit }, id) {
      return Api.requestProfile(id).then((response) => {
        commit("setSubsiteData", response.data.result);
      });
    },

    postCommentLike({ commit }, data) {
      commit("setCommentIsLiked", data);

      return Api.requestAddLike(data).catch((error) => {
        commit("setCommentIsLiked", {
          id: data.id,
          content: data.content,
          sign: data.sign,
          reset: true,
        });

        notify({
          type: "error",
          title: "Ошибка " + error.response.data.error.code,
          text: error.response.data.message,
        });
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
      return Api.requestComments(data).then((response) => {
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
      return Api.requestCreateComment(data);
    },

    editComment({}, data) {
      return Api.requestEditComment(data);
    },

    requestCommentEtcControls({ commit }, id) {
      return Api.requestCommentEtcControls(id).then((response) => {
        commit("setCommentEtcControls", {
          id,
          controls: response.data.result.etcControls,
        });
      });
    },
  },
};

export default entryPageModule;
