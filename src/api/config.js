import axios from "axios";

export const entryRatingInstance = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? "https://happy-yonath-c3d5de.netlify.app/entry/rating"
      : "http://localhost:8080/entry/rating",
});

export const instance_v1 = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? "https://happy-yonath-c3d5de.netlify.app/v1.9"
      : "http://localhost:8080/v1.9",
  headers: {
    "X-Device-Token": localStorage.getItem("token")
      ? localStorage.getItem("token")
      : sessionStorage.getItem("token"),
  },
});

export const instance_v2 = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? "https://happy-yonath-c3d5de.netlify.app/v2.1"
      : "http://localhost:8080/v2.1",
  headers: {
    "X-Device-Token": localStorage.getItem("token")
      ? localStorage.getItem("token")
      : sessionStorage.getItem("token"),
  },
});
