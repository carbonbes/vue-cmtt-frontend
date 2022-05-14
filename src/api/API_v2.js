import { instance_v2 } from "./config";

export const API_v2 = {
  getTimeline(data) {
    if (data.allSite !== "all") {
      if (data.sorting === "new" && data.lastId) {
        return instance_v2.get(
          `timeline?allSite=false&sorting=date&lastId=${data.lastId}`
        );
      }

      if (data.sorting === "new" && !data.lastId) {
        return instance_v2.get(`timeline?allSite=false&sorting=date`);
      }

      if ((data.sorting === "" || data.sorting === "popular") && !data.lastId) {
        return instance_v2.get(`timeline?allSite=false&sorting=hotness`);
      }

      if ((data.sorting === "" || data.sorting === "popular") && data.lastId) {
        return instance_v2.get(
          `timeline?allSite=false&sorting=hotness&lastId=${data.lastId}`
        );
      }

      if (data.sorting && !data.lastId) {
        return instance_v2.get(
          `timeline?allSite=false&sorting=${data.sorting}`
        );
      }

      if (data.sorting && data.lastId) {
        return instance_v2.get(
          `timeline?allSite=false&sorting=${data.sorting}&lastId=${data.lastId}`
        );
      }

      if (!data.sorting && !data.lastId && data.subsiteId) {
        return instance_v2.get(
          `timeline?allSite=false&subsitesIds=${data.subsiteId}`
        );
      }

      if (
        !data.sorting &&
        data.subsiteId &&
        data.lastId &&
        data.lastSortingValue
      ) {
        return instance_v2.get(
          `timeline?allSite=false&subsitesIds=${data.subsiteId}&lastId=${data.lastId}&lastSortingValue=${data.lastSortingValue}`
        );
      }
    }

    if (data.allSite === "all") {
      if (data.sorting === "new" && data.lastId) {
        return instance_v2.get(
          `timeline?allSite&sorting=date&lastId=${data.lastId}`
        );
      }

      if (data.sorting === "new" && !data.lastId) {
        return instance_v2.get(`timeline?allSite&sorting=date`);
      }

      if ((data.sorting === "" || data.sorting === "popular") && !data.lastId) {
        return instance_v2.get(`timeline?allSite&sorting=hotness`);
      }

      if ((data.sorting === "" || data.sorting === "popular") && data.lastId) {
        return instance_v2.get(
          `timeline?allSite&sorting=hotness&lastId=${data.lastId}`
        );
      }

      if (data.sorting && !data.lastId) {
        return instance_v2.get(`timeline?allSite&sorting=${data.sorting}`);
      }

      if (data.sorting && data.lastId) {
        return instance_v2.get(
          `timeline?allSite&sorting=${data.sorting}&lastId=${data.lastId}`
        );
      }

      if (!data.sorting && !data.lastId && data.subsiteId) {
        return instance_v2.get(
          `timeline?allSite&subsitesIds=${data.subsiteId}`
        );
      }
    }
  },

  getEntry(id) {
    return instance_v2.get(`content?id=${id}`);
  },

  getComments(data) {
    if (data.subsiteId && !data.lastId && !data.lastSortingValue) {
      return instance_v2.get(`comments?subsiteId=${data.subsiteId}`);
    }

    if (data.contentId && !data.lastId && !data.lastSortingValue) {
      return instance_v2.get(`comments?contentId=${data.contentId}`);
    }

    if (data.subsiteId && data.lastId && data.lastSortingValue) {
      return instance_v2.get(
        `comments?subsiteId=${data.subsiteId}&lastId=${data.lastId}&lastSortingValue=${data.lastSortingValue}`
      );
    }
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
