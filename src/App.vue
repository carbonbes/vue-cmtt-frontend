<template>
  <Header />
  <div class="layout">
    <left-sidebar />
    <main class="content"><router-view /></main>
    <right-sidebar />
  </div>
  <transition name="login-modal"
    ><div class="modal" v-if="loginModalVisibility">
      <login-modal :isShow="this.loginModalVisibility" /></div
  ></transition>
  <notifications />
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { mapActions } from "vuex";
import store from "@/store";
import io from "socket.io-client";
import Header from "@/components/Layout/Header/Header.vue";
import LeftSidebar from "@/components/Layout/LeftSidebar.vue";
import RightSidebar from "@/components/Layout/RightSidebar.vue";
import LoginModal from "@/components/Layout/LoginModal.vue";

export default {
  setup() {
    let socket = io("https://ws-sio.tjournal.ru", {
      transports: ["websocket"],
    });

    const unsubscribe = store.subscribe((mutation, state) => {
      if (mutation.type === "setIsAuth" && mutation.payload === true) {
        const userHash = localStorage.getItem("user_hash");

        socket.emit("subscribe", { channel: "mobile:" + userHash });

        socket.on("event", (data) => {
          if (
            data.data.type === 4 ||
            data.data.type === 8 ||
            data.data.type === 16 ||
            data.data.type === 32 ||
            data.data.type === 64
          ) {
            store.commit("setUnreadNotifications");
          }
        });

        socket.on("reconnect", () => {
          socket.emit("subscribe", { channel: "mobile:" + userHash });
        });
      }
    });

    onMounted(() => {
      socket.emit("subscribe", { channel: "api" });

      socket.on("event", (data) => {
        if (data.data.type === "content voted") {
          if (store.state.auth.auth.id !== data.data.subsite_id) {
            store.commit("apiChannelContentVoted", data.data);
          }
        }

        /* if (data.data.type === "new_entry_published") {
        store.commit("apiChannelNewEntry", data.data);
      } */
      });

      socket.on("reconnect", () => {
        socket.emit("subscribe", {
          channel: "api",
        });
      });

      store.dispatch("requestNotificationsCount");
    });

    onUnmounted(() => {
      socket.disconnect();
      unsubscribe();
    });
  },

  components: {
    Header,
    LeftSidebar,
    RightSidebar,
    LoginModal,
  },

  data() {
    return {
      currentTheme: null,
      timeout: null,
      loginModalVisibility: false,
    };
  },

  provide() {
    return { currentTheme: computed(() => this.currentTheme) };
  },

  methods: {
    setTheme() {
      let theme = localStorage.getItem("theme");

      if (theme === "light" || !theme) {
        this.currentTheme = false;
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        this.currentTheme = true;
        document.documentElement.setAttribute("data-theme", "dark");
      }
    },

    themeToggle() {
      document.documentElement.classList.add("theme-change");
      document.documentElement.setAttribute(
        "data-theme",
        this.currentTheme ? "light" : "dark"
      );
      localStorage.setItem("theme", this.currentTheme ? "light" : "dark");
      this.currentTheme = !this.currentTheme;
      this.timeout = setTimeout(() => {
        document.documentElement.classList.remove("theme-change");
      }, 200);
    },

    toggleShowLoginModal() {
      this.loginModalVisibility = !this.loginModalVisibility;
    },

    ...mapActions(["requestAuth"]),
  },

  created() {
    this.requestAuth();
    this.setTheme();
  },

  mounted() {
    this.emitter.on("theme-toggle", this.themeToggle);
    this.emitter.on("login-modal-toggle", this.toggleShowLoginModal);
  },

  beforeUnmount() {
    clearTimeout(this.timeout);
    this.emitter.off("theme-toggle", this.themeToggle);
    this.emitter.off("login-modal-toggle", this.toggleShowLoginModal);
  },
};
</script>

<style lang="scss">
@use "normalize.css";
@use "roboto.css";
@use "../node_modules/nprogress/nprogress.css";
@use "../node_modules/photoswipe/dist/photoswipe.css";
@use "style.scss";
@use "../node_modules/vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
</style>
