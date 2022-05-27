import { instance_v2 } from "./config";

export const API_v2 = {
  getTimeline(data) {
    return instance_v2.get("timeline", {
      params: {
        ...data.params,
      },
    });
  },

  getEntry(id) {
    return instance_v2.get(`content?id=${id}`);
  },

  getComments(data) {
    return instance_v2.get("comments", { params: { ...data.params } });
  },

  getCommentEtcControls(id) {
    return instance_v2.get("comment/etcControls", {
      params: { commentId: id },
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
};
