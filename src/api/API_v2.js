import { instance_v2 } from "./config";

export const API_v2 = {
  getTimeline(data) {
    if (data.sorting) {
      return instance_v2.get(`timeline?sorting=${data.sorting}`);
    }

    if (!data.sorting) {
      return instance_v2.get(`timeline?sorting=hotness`);
    }

    if (data.sorting && data.lastId) {
      return instance_v2.get(
        `timeline?sorting=${data.sorting}&lastId=${data.lastId}`
      );
    }

    if (!data.sorting && !data.lastId) {
      return instance_v2.get(`timeline?sorting="hotness`);
    }
  },

  getEntry(id) {
    return instance_v2.get(`content?id=${id}`);
  },

  subsite(id) {
    return instance_v2.get(`subsite?id=${id}`);
  },
};
