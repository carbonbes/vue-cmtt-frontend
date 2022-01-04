import axios from "axios";

export const instance_v1 = axios.create({
  baseURL: "http://localhost:8080/v1.9",
  headers: {
    "X-Device-Token": localStorage.getItem("token")
      ? localStorage.getItem("token")
      : sessionStorage.getItem("token"),
  },
});

export const instance_v2 = axios.create({
  baseURL: "http://localhost:8080/v2.1",
  headers: {
    "X-Device-Token": localStorage.getItem("token")
      ? localStorage.getItem("token")
      : sessionStorage.getItem("token"),
  },
});
