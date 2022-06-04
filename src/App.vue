<template>
  <Header />
  <div class="layout">
    <LeftSidebar />
    <main class="content"><router-view /></main>
    <RightSidebar />
  </div>
  <transition name="login-modal">
    <div class="modal" v-if="loginModalVisibility">
      <LoginModal :isShow="loginModalVisibility" />
    </div>
  </transition>
  <transition name="start-screen">
    <StartScreen :isShow="showStartScreen" v-if="showStartScreen" />
  </transition>
  <notifications />
</template>

<script>
import { computed, defineAsyncComponent } from "vue";
import { mapActions } from "vuex";
import store from "@/store";
import Header from "@/components/Layout/Header/Header.vue";
import LeftSidebar from "@/components/Layout/LeftSidebar.vue";
import RightSidebar from "@/components/Layout/RightSidebar.vue";
import StartScreen from "./components/Layout/StartScreen.vue";

export default {
  components: {
    Header,
    LeftSidebar,
    RightSidebar,
    LoginModal: defineAsyncComponent(() =>
      import("@/components/Layout/LoginModal.vue")
    ),
    StartScreen,
  },

  data() {
    return {
      currentTheme: null,
      timeout: null,
      loginModalVisibility: false,
      showStartScreen: true,
      unsubscribe: null,
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

    closeStartScreen() {
      this.showStartScreen = false;
    },

    startScreenWatch() {
      this.unsubscribe = store.subscribe((mutation) => {
        if (mutation.type === "closeStartScreen") {
          this.closeStartScreen();
        }
      });
    },

    ...mapActions(["requestAuth"]),
  },

  created() {
    this.requestAuth();
    this.setTheme();
  },

  mounted() {
    store.commit("connectApiChannel");
    store.dispatch("requestNotificationsCount");

    this.emitter.on("theme-toggle", this.themeToggle);
    this.emitter.on("login-modal-toggle", this.toggleShowLoginModal);

    this.startScreenWatch();
  },

  beforeUnmount() {
    store.commit("disconnectApiChannel");

    clearTimeout(this.timeout);

    this.emitter.off("theme-toggle", this.themeToggle);
    this.emitter.off("login-modal-toggle", this.toggleShowLoginModal);

    this.unsubscribe();
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
