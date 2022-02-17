import { instance_v2 } from "./config";

export const API_v2 = {
  getTimeline(data) {
    if (!data.sorting && !data.lastId) {
      return instance_v2.get("timeline?sorting=hotness");
    }

    if (data.sorting === "new" && data.lastId) {
      return instance_v2.get(`timeline?sorting=date&lastId=${data.lastId}`);
    }

    if (data.sorting === "new" && !data.lastId) {
      return instance_v2.get(`timeline?sorting=date`);
    }

    if (data.sorting === "" && data.lastId) {
      return instance_v2.get(`timeline?sorting=hotness&lastId=${data.lastId}`);
    }
  },

  getEntry(id) {
    return instance_v2.get(`content?id=${id}`);
  },

  subsite(id) {
    return instance_v2.get(`subsite?id=${id}`);
  },

  subsiteMe() {
    return instance_v2.get("subsite/me");
  },
};
