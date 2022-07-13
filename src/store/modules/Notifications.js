import Api from "@/api";

const notificationsModule = {
  state: () => ({
    notificationsList: [],
    notificationsCount: 0,
    unreadNotifications: 0,
    lastId: null,
  }),

  getters: {
    notifications(state) {
      return state.notificationsList;
    },

    notificationsCount(state) {
      return state.notificationsCount;
    },

    unreadNotifications(state) {
      return state.unreadNotifications;
    },

    notificationsLastId(state) {
      return state.lastId;
    },
  },

  mutations: {
    setNotificationsList(state, data) {
      state.notificationsList.push(...data);
    },

    setNotificationsCount(state, data) {
      state.notificationsCount = data;
    },

    setUnreadNotifications(state) {
      state.unreadNotifications = ++state.unreadNotifications;
      state.notificationsCount = ++state.notificationsCount;
    },

    setNotificationsLastId(state, data) {
      state.lastId = data;
    },

    clearNotifications(state) {
      state.notificationsList = [];
      state.notificationsCount = 0;
      state.unreadNotifications = 0;
      state.lastId = null;
    },
  },

  actions: {
    requestNotifications({ commit, state }, data) {
      return Api.requestNotifications(data).then((response) => {
        commit("setNotificationsList", response.data.result);
        if (state.notificationsList.length > 0) {
          commit(
            "setNotificationsLastId",
            state.notificationsList[state.notificationsList.length - 1].group_id
          );
        }
      });
    },

    requestNotificationsCount({ commit }) {
      return Api.requestNotificationsCount().then((response) => {
        commit("setNotificationsCount", response.data.result.count);
      });
    },
  },
};

export default notificationsModule;
