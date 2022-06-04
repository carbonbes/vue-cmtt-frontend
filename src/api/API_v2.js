import { instance_v2 } from "./config";
import { instance_v2_31 } from "./config";

export const API_v2 = {
  getFeed(params) {
    return instance_v2_31.get("feed", {
      params: {
        ...params,
      },
    });
  },

  getTimeline(params) {
    return instance_v2.get("timeline", {
      params: {
        ...params,
      },
    });
  },

  getEntry(id) {
    return instance_v2.get(`content?id=${id}`);
  },

  getComments(data) {
    return instance_v2.get("comments", { params: { ...data.params } });
  },

  getCommentEtcControls(commentId) {
    return instance_v2.get("comment/etcControls", {
      params: { commentId },
    });
  },

  subsite(id) {
    return instance_v2.get(`subsite?id=${id}`);
  },

  subsiteMe() {
    return instance_v2.get("subsite/me");
  },

  subscriptions(myId) {
    return instance_v2.get(`subsite/subscriptions?subsiteId=${myId}`);
  },

  getShortNews(data) {
    return instance_v2.get("news", { params: { ...data } });
  },
};
