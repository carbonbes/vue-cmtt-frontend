import { instance_v1, instance_v2, instance_v2_31 } from "./config";

const Api = {
  requestLogin(data) {
    let formData = new FormData();
    formData.append("login", data.email);
    formData.append("password", data.password);

    return instance_v1.post("auth/login", formData);
  },

  requestEntryLikes(entryId) {
    return instance_v2_31.get(`content/likers/${entryId}`);
  },

  requestCommentLikes(id) {
    return instance_v1.get(`comment/likers/${id}`);
  },

  requestCreateComment(data) {
    let formData = new FormData();

    formData.append("id", data.id);
    formData.append("reply_to", data.reply_to);
    formData.append("text", data.text);
    formData.append("attachments", data.attachments);

    return instance_v1.post("comment/add", formData);
  },

  requestEditComment(data) {
    let formData = new FormData();

    formData.append("id", data.entryId);
    formData.append("comment_id", data.commentId);
    formData.append("text", data.text);
    formData.append("attachments", data.attachments);

    return instance_v1.post("comment/edit", formData);
  },

  requestAddLike(data) {
    let formData = new FormData();
    formData.append("id", data.id);
    formData.append("type", data.type);
    formData.append("sign", data.sign);

    return instance_v1.post("like", formData);
  },

  requestUploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);

    return instance_v1.post("uploader/upload", formData);
  },

  requestNotifications(data) {
    if (!data.lastId) {
      return instance_v1.get("user/me/updates?is_read=1");
    } else if (data.lastId) {
      return instance_v1.get(
        `user/me/updates?is_read=1&last_id=${data.lastId}`
      );
    }
  },

  requestNotificationsCount() {
    return instance_v1.get("user/me/updates/count");
  },

  requestCreateEntry(data) {
    console.log(data);
    let formData = new FormData();

    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("subsite_id", data.subsite_id);
    formData.append("attachments", data.attachments);

    return instance_v1.post("entry/create", formData);
  },

  requestFeed(params) {
    return instance_v2_31.get("feed", {
      params: {
        ...params,
      },
    });
  },

  requestTimeline(params) {
    return instance_v2.get("timeline", {
      params: {
        ...params,
      },
    });
  },

  requestEntry(id) {
    return instance_v2.get(`content?id=${id}`);
  },

  requestComments(data) {
    return instance_v2.get("comments", { params: { ...data.params } });
  },

  requestCommentEtcControls(commentId) {
    return instance_v2.get("comment/etcControls", {
      params: { commentId },
    });
  },

  requestProfile(id) {
    return instance_v2.get(`subsite?id=${id}`);
  },

  requestMyProfile() {
    return instance_v2.get("subsite/me");
  },

  requestDigest(data) {
    return instance_v2.get("news", { params: { ...data } });
  },
};

export default Api;
