import { instance_v2 } from "./config";

export const API_v2 = {
  getTimeline(data) {
    if (data.sorting === "new" && data.lastId) {
      return instance_v2.get(`timeline?sorting=date&lastId=${data.lastId}`);
    }

    if (data.sorting === "new" && !data.lastId) {
      return instance_v2.get(`timeline?sorting=date`);
    }

    if ((data.sorting === "" || data.sorting === "popular") && !data.lastId) {
      return instance_v2.get(`timeline?sorting=hotness`);
    }

    if ((data.sorting === "" || data.sorting === "popular") && data.lastId) {
      return instance_v2.get(`timeline?sorting=hotness&lastId=${data.lastId}`);
    }

    if (data.sorting && !data.lastId) {
      return instance_v2.get(`timeline?sorting=${data.sorting}`);
    }

    if (data.sorting && data.lastId) {
      return instance_v2.get(
        `timeline?sorting=${data.sorting}&lastId=${data.lastId}`
      );
    }

    if (!data.sorting && !data.lastId && data.subsiteId) {
      return instance_v2.get(`timeline?subsitesIds=${data.subsiteId}`);
    }
  },

  getEntry(id) {
    return instance_v2.get(`content?id=${id}`);
  },

  getComments(data) {
    if (data.subsiteId) {
      return instance_v2.get(`comments?subsiteId=${data.subsiteId}`);
    } else {
      return instance_v2.get(`comments?contentId=${data.contentId}`);
    }
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
