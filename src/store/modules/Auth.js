import { API_v2 } from "../../api/API_v2";

const entryModule = {
  state: () => ({
    auth: [],
  }),

  getters: {
    auth(state) {
      return state.auth;
    },
  },

  mutations: {
    setAuth(state, data) {
      state.auth = data;
    },
  },

  actions: {
    requestAuth({ commit }) {
      return API_v2.subsiteMe().then((response) => {
        if (response.data.result) {
          commit("setAuth", response.data.result);
        }
      });
    },
  },
};

export default entryModule;
