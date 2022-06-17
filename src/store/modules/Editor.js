import { API_v1 } from "@/api/API_v1";

const editorModule = {
  state: () => ({
    subsitesList: null,
  }),

  getters: {
    subsitesList(state) {
      return state.subsitesList;
    },
  },

  mutations: {
    setSubsitesList(state, data) {
      state.subsitesList = data;
    },
  },

  actions: {
    requestSubsitesList() {},

    createEntry({}, data) {
      return API_v1.createEntry(data);
    },
  },
};

export default editorModule;
