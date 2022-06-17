import { instance_v1 } from "./config";

export const API_v1 = {
  requestLogin(data) {
    let formData = new FormData();
    formData.append("login", data.email);
    formData.append("password", data.password);

    return instance_v1.post("auth/login", formData);
  },

  getCommentLikes(id) {
    return instance_v1.get(`comment/likers/${id}`);
  },

  postComment(data) {
    let formData = new FormData();

    formData.append("id", data.id);
    formData.append("reply_to", data.reply_to);
    formData.append("text", data.text);
    formData.append("attachments", data.attachments);

    return instance_v1.post("comment/add", formData);
  },

  editComment(data) {
    let formData = new FormData();

    formData.append("id", data.entryId);
    formData.append("comment_id", data.commentId);
    formData.append("text", data.text);
    formData.append("attachments", data.attachments);

    return instance_v1.post("comment/edit", formData);
  },

  postLike(data) {
    let formData = new FormData();
    formData.append("id", data.id);
    formData.append("type", data.type);
    formData.append("sign", data.sign);

    return instance_v1.post("like", formData);
  },

  uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);

    return instance_v1.post("uploader/upload", formData);
  },

  myNotifications(data) {
    if (!data.lastId) {
      return instance_v1.get("user/me/updates?is_read=1");
    } else if (data.lastId) {
      return instance_v1.get(
        `user/me/updates?is_read=1&last_id=${data.lastId}`
      );
    }
  },

  myNotificationsCount() {
    return instance_v1.get("user/me/updates/count");
  },

  createEntry(data) {
    console.log(data);
    let formData = new FormData();

    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("subsite_id", data.subsite_id);
    formData.append("attachments", data.attachments);

    return instance_v1.post("entry/create", formData);
  },

  searchUserForMention(query) {
    return instance_v1.get("search-for-mentions", { query: { q: query } });
  },
};
