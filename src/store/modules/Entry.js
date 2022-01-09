import { API_v2 } from "../../api/API_v2";

const entryModule = {
  state: () => ({
    entry: [],
  }),

  getters: {
    entry(state) {
      return state.entry;
    },
  },

  mutations: {
    setEntry(state, data) {
      state.entry = data;
    },

    clearEntry(state) {
      state.entry = [];
    },
  },

  actions: {
    requestEntry({ commit }, id) {
      return API_v2.getEntry(id).then((response) => {
        commit("setEntry", response.data.result);
      });
    },
  },
};

export default entryModule;
