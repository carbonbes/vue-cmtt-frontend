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
    formData.append("text", data.text);
    formData.append("reply_to", data.reply_to);
    formData.append("attachments", data.attachments);

    return instance_v1.post("comment/add", formData);
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
};
