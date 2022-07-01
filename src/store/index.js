import { createStore } from "vuex";
import AuthModule from "./modules/Auth";
import FeedModule from "./modules/FeedPage";
import EntryPageModule from "./modules/EntryPage";
import ProfilePageModule from "./modules/ProfilePage";
import NotificationsModule from "./modules/Notifications";
import EditorModule from "./modules/Editor";
import createWebSocketPlugin from "./plugins/createWebSocketPlugin";
import { API_v1 } from "@/api/API_v1";
import { API_v2 } from "@/api/API_v2";
import { entryRatingInstance, entryRepostsInstance } from "@/api/config";
import { notify } from "@kyvg/vue3-notification";

const plugin = createWebSocketPlugin();

export default createStore({
  modules: {
    auth: AuthModule,
    feed: FeedModule,
    entry: EntryPageModule,
    profile: ProfilePageModule,
    notifications: NotificationsModule,
    editor: EditorModule,
  },

  state: () => ({
    subscriptions: null,
    ignoredProfiles: null,
  }),

  getters: {
    subscriptions(state) {
      return state.subscriptions;
    },

    ignoredProfiles(state) {
      return state.ignoredProfiles;
    },
  },

  mutations: {
    connectApiChannel() {},
    disconnectApiChannel() {},
    closeStartScreen() {},

    setSubscriptions(state, data) {
      state.subscriptions = data;
    },

    setIgnoredProfiles(state, data) {
      state.ignoredProfiles = data;
    },
  },

  actions: {
    entryLike({ commit }, data) {
      commit(
        data.articleType === "feedArticle"
          ? "setFeedEntryIsLiked"
          : data.articleType === "profileArticle"
          ? "setProfileEntryIsLiked"
          : data.articleType === "pageArticle"
          ? "setPageEntryIsLiked"
          : null,
        data
      );

      return API_v1.postLike(data).catch((error) => {
        commit(
          data.articleType === "feedArticle"
            ? "setFeedEntryIsLiked"
            : data.articleType === "profileArticle"
            ? "setProfileEntryIsLiked"
            : data.articleType === "pageArticle"
            ? "setPageEntryIsLiked"
            : null,
          {
            id: data.id,
            content: data.content,
            sign: data.sign,
            reset: true,
          }
        );

        notify({
          type: "error",
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
            if (data.subtype === "pageArticle") {
              commit("setArticlePageLikesList", {
                data: response.data.data.likers,
              });
            } else if (data.subtype === "feedArticle") {
              commit("setFeedArticleLikesList", {
                id: data.id,
                data: response.data.data.likers,
              });
            } else if (data.subtype === "profileArticle") {
              commit("setProfileArticleLikesList", {
                id: data.id,
                data: response.data.data.likers,
              });
            }
          })
          .catch((e) => {
            notify({
              type: "error",
              title: "Ошибка " + e.response.data.error.code,
              text: e.response.data.message,
            });
          });
      } else if (data.type === "comment") {
        return API_v1.getCommentLikes(data.id)
          .then((response) => {
            commit("setCommentLikesList", {
              commentId: data.id,
              data: response.data.result,
            });
          })
          .catch((e) => {
            notify({
              type: "error",
              title: "Ошибка " + e.response.data.error.code,
              text: e.response.data.message,
            });
          });
      }
    },

    uploadFile({}, file) {
      return API_v1.uploadFile(file);
    },

    requestSubscriptions({ commit }, subsiteId) {
      return API_v2.subscriptions(subsiteId).then((response) => {
        commit("setSubscriptions", response.data.result.items);
      });
    },

    requestIgnoredSubsites({ commit }) {
      return API_v1.requestIgnoredSubsites().then((response) => {
        commit("setIgnoredProfiles", response.data.result);
      });
    },
  },

  plugins: [plugin],
});
