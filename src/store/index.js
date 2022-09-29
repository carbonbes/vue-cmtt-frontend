import { createStore } from "vuex";
import AuthModule from "./modules/Auth";
import FeedModule from "./modules/FeedPage";
import EntryPageModule from "./modules/EntryPage";
import ProfilePageModule from "./modules/ProfilePage";
import NotificationsModule from "./modules/Notifications";
import EditorModule from "./modules/Editor";
import createWebSocketPlugin from "./plugins/createWebSocketPlugin";
import Api from "@/api";
import { instance_v1, instance_v2 } from "../api/config";
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

  mutations: {
    connectApiChannel() {},
    disconnectApiChannel() {},
    closeStartScreen() {},
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

      return Api.requestAddLike(data).catch((error) => {
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
        return Api.requestEntryLikes(data.id)
          .then((response) => {
            if (data.subtype === "pageArticle") {
              commit("setArticlePageLikesList", {
                data: response.data.result,
              });
            } else if (data.subtype === "feedArticle") {
              commit("setFeedArticleLikesList", {
                id: data.id,
                data: response.data.result,
              });
            } else if (data.subtype === "profileArticle") {
              commit("setProfileArticleLikesList", {
                id: data.id,
                data: response.data.result,
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
        return Api.requestCommentLikes(data.id)
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
      return Api.requestUploadFile(file);
    },

    requestSubscriptions({ commit }, subsiteId) {
      let token = localStorage.getItem("token");

      return instance_v2
        .get(`subsite/subscriptions?subsiteId=${subsiteId}`, {
          headers: { "X-Device-Token": token },
        })
        .then((response) => {
          localStorage.setItem(
            "subscriptions",
            JSON.stringify(response.data.result.items)
          );
        });
    },

    requestIgnoredSubsites({ commit }) {
      let token = localStorage.getItem("token");

      return instance_v1
        .get("ignores/subsites", {
          headers: { "X-Device-Token": token },
        })
        .then((response) => {
          localStorage.setItem(
            "ignoredProfiles",
            JSON.stringify(response.data.result)
          );
        });
    },
  },

  plugins: [plugin],
});
