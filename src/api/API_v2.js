import { instance_v2 } from "./config";

export const API_v2 = {
  getTimeline(data) {
    if (data.sorting) {
      return instance_v2.get(`timeline?sorting=${data.sorting}`);
    }

    if (!data.sorting) {
      return instance_v2.get(`timeline?sorting=hotness`);
    }
  },
};
