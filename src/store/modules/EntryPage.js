import { API_v1 } from "../../api/API_v1";
import { API_v2 } from "../../api/API_v2";
import { entryRatingInstance, entryRepostsInstance } from "../../api/config";
import { notify } from "@kyvg/vue3-notification";

const entryPageModule = {
  state: () => ({
    entry: [],
    entryPrevLiked: null,
    subsiteData: [],
    entrylikesList: null,
    repostsList: null,
    commentsList: null,
    unreadComments: null,
    hoveredHighlightComment: null,
    temporaryHightlightComment: null,
    idCommentVisibledReplyForm: null,
    commentIsSended: false,
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

    unreadComments(state) {
      return state.unreadComments;
    },

    hoveredHighlightComment(state) {
      return state.hoveredHighlightComment;
    },

    temporaryHightlightComment(state) {
      return state.temporaryHightlightComment;
    },

    idCommentVisibledReplyForm(state) {
      return state.idCommentVisibledReplyForm;
    },

    commentIsSended(state) {
      return state.commentIsSended;
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

    setIdCommentVisibledReplyForm(state, id) {
      state.idCommentVisibledReplyForm = id;
    },

    clearIdCommentVisibledReplyForm(state) {
      state.idCommentVisibledReplyForm = null;
    },

    setCommentIsSended(state, value) {
      state.commentIsSended = value;
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
          state.entry.likes.isLiked = data.sign;

          state.entry.likes.summ =
            sign === -1 && (summ <= 0 || summ >= 0)
              ? --state.entry.likes.summ
              : sign === 0 && summ <= 0
              ? ++state.entry.likes.summ
              : sign === 0 && summ >= 0
              ? --state.entry.likes.summ
              : sign === 1 && (summ <= 0 || summ >= 0)
              ? ++state.entry.likes.summ
              : null;
        }
      }
    },

    setCommentPrevLiked(state, data) {
      state.commentsList.find((comment) => {
        if (comment.id == data.id) {
          comment.likes.prevIsLiked = null;
          comment.likes.prevIsLiked = data.sign;
        }
      });
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
            comment.likes.isLiked = data.sign;

            comment.likes.summ =
              sign === -1 && (summ <= 0 || summ >= 0)
                ? --comment.likes.summ
                : sign === 0 && summ <= 0
                ? ++comment.likes.summ
                : sign === 0 && summ >= 0
                ? --comment.likes.summ
                : sign === 1 && (summ <= 0 || summ >= 0)
                ? ++comment.likes.summ
                : null;
          }
        }
      });
    },

    apiChannelContentVoted(state, data) {
      if (state.entry.id === data.id) {
        state.entry.likes.summ = data.count;
      }
    },

    entryCommentsChannelVoted(state, data) {
      state.commentsList.find((comment) => {
        if (comment.id === data.id) {
          comment.likes.summ = data.count;
        }
      });
    },

    entryCommentsChannelCreated(state, data) {
      let newComment = data.comment;
      newComment.replies = [];
      newComment.likes.isLiked = data.comment.likes.is_liked;
      newComment.isIgnored = data.comment.is_ignored;
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

    postComment({ commit }, data) {
      commit("setCommentIsSended", true);

      return API_v1.postComment(data).then(() => {
        commit("setCommentIsSended", false);
      });
    },
  },
};

export default entryPageModule;
