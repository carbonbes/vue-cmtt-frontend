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
    requestAuth({ commit, dispatch }) {
      commit("setAuthIsRequested", true);

      API_v2.subsiteMe()
        .then((response) => {
          commit("setAuth", response.data.result);
          commit("setIsAuth", true);
          commit("setAuthIsRequested", false);
          dispatch("mySubscriptions", response.data.result.id);
        })
        .catch(() => {
          commit("setIsAuth", false);
          commit("setAuthIsRequested", false);
        });
    },

    requestLogin({ commit }, data) {
      commit("setLoginIsRequested", true);
      commit("setIsError", false);

      API_v1.requestLogin(data)
        .then((response) => {
          if (data.rememberMe) {
            localStorage.setItem("token", response.headers["x-device-token"]);
            localStorage.setItem("m_hash", response.data.result["m_hash"]);
            localStorage.setItem(
              "user_hash",
              response.data.result["user_hash"]
            );
          } else {
            sessionStorage.setItem("token", response.headers["x-device-token"]);
            sessionStorage.setItem("m_hash", response.data.result["m_hash"]);
            sessionStorage.setItem(
              "user_hash",
              response.data.result["user_hash"]
            );
          }
          location.reload();
        })
        .catch((error) => {
          commit("setLoginIsRequested", false);
          commit("setIsError", true);
          commit("setError", error.response.data);
        });
    },

    mySubscriptions({}, myId) {
      API_v2.subscriptions(myId).then((response) => {
        localStorage.setItem(
          "my-subscriptions",
          JSON.stringify(response.data.result.items)
        );
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
