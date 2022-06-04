import axios from "axios";

const token = localStorage.getItem("token");

export const instance_v1 = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? process.env.VUE_APP_API_BASE_URL + "/v1.9"
      : "http://localhost:8080/v1.9",
  headers: {
    "X-Device-Token": token,
  },
});

export const instance_v2 = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? process.env.VUE_APP_API_BASE_URL + "/v2.1"
      : "http://localhost:8080/v2.1",
  headers: {
    "X-Device-Token": token,
  },
});

export const instance_v2_31 = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? process.env.VUE_APP_API_BASE_URL + "/v2.31"
      : "http://localhost:8080/v2.31",
  headers: {
    "X-Device-Token": token,
  },
});

export const entryRatingInstance = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? process.env.VUE_APP_API_BASE_URL + "/entry/rating"
      : "http://localhost:8080/entry/rating",
});

export const entryRepostsInstance = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? process.env.VUE_APP_API_BASE_URL + "/entry/reposts"
      : "http://localhost:8080/entry/reposts",
});
