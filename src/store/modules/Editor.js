import Api from "@/api";

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
      return Api.requestCreateEntry(data);
    },
  },
};

export default editorModule;
