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
  <transition name="editor-component">
    <div class="modal" v-if="editorVisible">
      <Editor :isVisible="this.editorVisible" :closeEditor="this.closeEditor" />
    </div>
  </transition>
  <transition name="start-screen">
    <StartScreen v-if="showStartScreen" />
  </transition>
  <Notification />
</template>

<script>
import { computed, defineAsyncComponent } from "vue";
import { mapActions } from "vuex";
import store from "@/store";
import Header from "@/components/Layout/Header/Header.vue";
import LeftSidebar from "@/components/Layout/LeftSidebar.vue";
import RightSidebar from "@/components/Layout/RightSidebar.vue";
import StartScreen from "@/components/Layout/StartScreen.vue";
import Notification from "@/components/Notification.vue";

export default {
  components: {
    Header,
    LeftSidebar,
    RightSidebar,
    LoginModal: defineAsyncComponent(() =>
      import("@/components/Layout/LoginModal.vue")
    ),
    StartScreen,
    Notification,
    Editor: defineAsyncComponent(() =>
      import("@/components/Editor/Editor.vue")
    ),
  },

  data() {
    return {
      currentTheme: null,
      timeout: null,
      loginModalVisibility: false,
      showStartScreen: true,
      unsubscribe: null,
      editorVisible: false,
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

    setFeedDefaultSettings() {
      const pageName = localStorage.getItem("pageName");
      const popularFeedSorting = localStorage.getItem("popularFeedSorting");
      const newFeedSorting = localStorage.getItem("newFeedSorting");
      const myFeedSorting = localStorage.getItem("myFeedSorting");

      if (
        !pageName ||
        !popularFeedSorting ||
        !newFeedSorting ||
        !myFeedSorting
      ) {
        localStorage.setItem("pageName", "popular");
        localStorage.setItem("popularFeedSorting", "hotness");
        localStorage.setItem("newFeedSorting", "from-10");
        localStorage.setItem("myFeedSorting", "popular");
      }
    },

    toggleVisibleEditor() {
      this.editorVisible = !this.editorVisible;
    },

    closeEditor() {
      this.editorVisible = false;
    },

    ...mapActions(["requestAuth"]),
  },

  created() {
    this.requestAuth();
    this.setTheme();
    this.setFeedDefaultSettings();
  },

  mounted() {
    store.commit("connectApiChannel");
    store.dispatch("requestNotificationsCount");

    this.emitter.on("theme-toggle", this.themeToggle);
    this.emitter.on("login-modal-toggle", this.toggleShowLoginModal);
    this.emitter.on("editor-modal-toggle", this.toggleVisibleEditor);

    this.startScreenWatch();
  },

  beforeUnmount() {
    store.commit("disconnectApiChannel");

    clearTimeout(this.timeout);

    this.emitter.off("theme-toggle", this.themeToggle);
    this.emitter.off("login-modal-toggle", this.toggleShowLoginModal);
    this.emitter.off("editor-modal-toggle", this.toggleVisibleEditor);

    this.unsubscribe();
  },
};
</script>

<style lang="scss">
@import "style.scss";
</style>
