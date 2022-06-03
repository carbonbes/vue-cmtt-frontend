import axios from "axios";
import { API_v1 } from "../../api/API_v1";
import { API_v2 } from "../../api/API_v2";

const authModule = {
  state: () => ({
    auth: [],
    isAuth: false,
    isAuthRequested: false,
    isLoginRequested: false,
    isError: false,
    error: [],
  }),

  getters: {
    auth(state) {
      return state.auth;
    },

    isAuth(state) {
      return state.isAuth;
    },

    isAuthRequested(state) {
      return state.isAuthRequested;
    },

    isLoginRequested(state) {
      return state.isLoginRequested;
    },

    isError(state) {
      return state.isError;
    },

    error(state) {
      return state.error;
    },
  },

  mutations: {
    setAuth(state, data) {
      state.auth = data;
    },

    setIsAuth(state, value) {
      state.isAuth = value;
    },

    setAuthIsRequested(state, value) {
      state.isAuthRequested = value;
    },

    setLoginIsRequested(state, value) {
      state.isLoginRequested = value;
    },

    setIsError(state, value) {
      state.isError = value;
    },

    setError(state, data) {
      state.error = data;
    },
  },

  actions: {
    requestAuth({ commit }) {
      commit("setAuthIsRequested", true);

      API_v2.subsiteMe()
        .then((response) => {
          localStorage.m_hash = response.data.result.mHash;
          localStorage.user_hash = response.data.result.userHash;

          commit("setAuth", response.data.result);
          commit("setIsAuth", true);
          commit("setAuthIsRequested", false);
        })
        .catch(() => {
          commit("setIsAuth", false);
          commit("setAuthIsRequested", false);
        });
    },

    requestLogin({ commit, dispatch }, data) {
      commit("setLoginIsRequested", true);
      commit("setIsError", false);

      API_v1.requestLogin(data)
        .then((response) => {
          localStorage.token = response.headers["x-device-token"];
          dispatch("mySubscriptions", {
            token: response.headers["x-device-token"],
            myId: response.data.result.id,
          }).then((response) => {
            localStorage.setItem(
              "my_subscriptions",
              JSON.stringify(response.data.result.items)
            );
            location.reload();
          });
        })
        .catch((error) => {
          commit("setLoginIsRequested", false);
          commit("setIsError", true);
          commit("setError", error.response.data);
        });
    },

    mySubscriptions({}, data) {
      return axios.get(
        process.env.NODE_ENV == "production"
          ? process.env.VUE_APP_API_BASE_URL +
              "/v2.1/subsite/subscriptions?subsiteId=" +
              data.myId
          : "http://localhost:8080/v2.1/subsite/subscriptions?subsiteId=" +
              data.myId,
        {
          headers: {
            "X-Device-Token": data.token,
          },
        }
      );
    },

    logout() {
      localStorage.clear();
      sessionStorage.clear();

      location.reload();
    },
  },
};

export default authModule;
