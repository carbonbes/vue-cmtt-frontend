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
};
