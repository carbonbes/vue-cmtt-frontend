import { createStore } from "vuex";
import AuthModule from "./modules/Auth";
import FeedModule from "./modules/FeedPage";
import EntryPageModule from "./modules/EntryPage";
import ProfilePageModule from "./modules/ProfilePage";
import NotificationsModule from "./modules/Notifications";
import createWebSocketPlugin from "./plugins/createWebSocketPlugin";
import { API_v1 } from "@/api/API_v1";
import { notify } from "@kyvg/vue3-notification";
import { entryRatingInstance, entryRepostsInstance } from "@/api/config";

const plugin = createWebSocketPlugin();

export default createStore({
  modules: {
    auth: AuthModule,
    feed: FeedModule,
    entry: EntryPageModule,
    profile: ProfilePageModule,
    notifications: NotificationsModule,
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
  },

  plugins: [plugin],
});
