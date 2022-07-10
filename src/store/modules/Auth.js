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

      return API_v2.subsiteMe()
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

          Promise.all([
            dispatch("requestSubscriptions", response.data.result.id),
            dispatch("requestIgnoredSubsites"),
          ]).then(() => {
            location.reload();
          });
        })
        .catch((error) => {
          commit("setLoginIsRequested", false);
          commit("setIsError", true);
          commit("setError", error.response.data);
        });
    },

    logout() {
      localStorage.clear();
      sessionStorage.clear();

      location.reload();
    },
  },
};

export default authModule;
