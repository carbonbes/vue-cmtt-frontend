<template>
  <Header />
  <div class="layout">
    <left-sidebar />
    <main class="content"><router-view /></main>
    <right-sidebar />
  </div>
  <transition name="login-modal"
    ><div
      class="modal"
      v-if="loginModalVisibility"
      v-scroll-lock="{ state: this.loginModalVisibility, gap: true }"
    >
      <login-modal /></div
  ></transition>
  <notification />
</template>

<script>
import { computed } from "vue";
import { mapActions } from "vuex";
import Header from "@/components/Layout/Header/Header.vue";
import LeftSidebar from "@/components/Layout/LeftSidebar.vue";
import RightSidebar from "@/components/Layout/RightSidebar.vue";
import LoginModal from "@/components/Layout/LoginModal.vue";
import Notification from "@/components/Layout/Notification.vue";

export default {
  components: {
    Header,
    LeftSidebar,
    RightSidebar,
    LoginModal,
    Notification,
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
    ...mapActions(["requestAuth"]),

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

:root {
  --brand-color: #e5a040;
  --grey-color: #595959;
  --blue-color: #3766a9;
  --green-color: #07a23b;
  --red-color: #e92a40;
  --black-color: #000;
  --bg-color: #f2f2f2;
  --header-bg-color: #fff4e2;
  --sidebar-bg-color: var(--bg-color);
  --entry-bg-color: #fff;
  --embed-border-color: #0000001a;
  --dropdown-bg-color: #fff;
  --dropdown-item-hover-bg-color: #f4f5f6;
  --link-block-bg-color: var(--embed-bg-color);
  --highlight-block-color: #fffaf1;
  --left-sidebar-link-hover-color: #ffffff80;
  --active-item-color: #fff;
  --rating-button-hover: #0000000d;
  --loader-grey-color: #cacaca;
  --form-bg-color: #f5f5f5;
  --form-border-color: #e6e6e6;
  --form-border-color-hover: #bdd6fa;
  --form-border-color-active: #4683d9;
  --form-shadow: 0 0 0 3px rgb(70 131 217 / 12%);
  --entry-thin-cover-gap: 0 20px;
}

[data-theme="dark"] {
  --grey-color: #939393;
  --blue-color: #6794cc;
  --green-color: #5fb668;
  --red-color: #c2646d;
  --black-color: #f2f2f2;
  --bg-color: #000;
  --header-bg-color: #202020;
  --entry-bg-color: #151515;
  --embed-border-color: #303030;
  --dropdown-bg-color: #353535;
  --dropdown-item-hover-bg-color: #4d4d4d;
  --highlight-block-color: #1d1d1d;
  --left-sidebar-link-hover-color: #1f1f1fbf;
  --active-item-color: #1e1e1e;
  --rating-button-hover: #ffffff0d;
  --loader-grey-color: #595959;
  --form-bg-color: #252525;
  --form-border-color: #303030;
  --form-border-color-hover: #3f597c;
  --form-border-color-active: #608eca;
  --form-shadow: 0 0 0 3px rgb(70 131 217 / 20%);
}

* {
  box-sizing: border-box;
}

.theme-change {
  & * {
    transition: background 0.2s, border 0.2s;
  }
}

.loader {
  position: absolute;
  top: 100%;
  width: 100%;
  height: 2px;
}

#nprogress .bar {
  height: 3px;
  background: var(--brand-color);
}

#nprogress .peg {
  box-shadow: none;
}

a {
  color: inherit;
  text-decoration: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}

.v-input,
.v-textarea {
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-internal-autofill-selected {
    -webkit-text-fill-color: var(--black-color);
    transition: background-color 5000s 0s;
  }
  &::placeholder {
    color: var(--grey-color);
  }
  color: var(--black-color);
  background-color: var(--form-bg-color);
  border: 1px solid var(--form-border-color);
  outline: none;
  transition: background-color 0.1s, border 0.1s, box-shadow 0.1s;

  &:hover:enabled {
    background-color: transparent;
    border: 1px solid var(--form-border-color-hover);
    box-shadow: var(--form-shadow);
  }

  &:focus-visible {
    background-color: transparent;
    border: 1px solid var(--form-border-color-active) !important;
    box-shadow: var(--form-shadow);
  }

  &:disabled {
    opacity: 0.7;
  }
}

.button {
  padding: 0;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  user-select: none;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &_a {
    background: #fff;
    color: #000;
    box-shadow: 0 1px 2px rgb(0 0 0 / 8%), inset 0 0 0 1px rgb(0 0 0 / 6%),
      inset 0 -1px 0 rgb(0 0 0 / 12%), inset 1px 0 0 rgb(0 0 0 / 6%),
      inset -1px 0 0 rgb(0 0 0 / 6%);
  }

  &_b {
    background: #4683d9;
    color: #fff;
    box-shadow: 0 1px 2px rgb(70 131 217 / 48%), inset 0 -1px 0 rgb(0 0 0 / 12%);

    &:hover {
      background: #437cce;
    }

    &:active {
      box-shadow: inset 0 -1px 0 rgb(0 0 0 / 12%);
    }
  }

  &__label,
  &__icon {
    padding: 0 15px;
  }

  &:active {
    transform: translateY(1px);
  }
}

body {
  margin: 0;
  font-family: "Roboto", sans-serif;
  background: var(--bg-color);
  overflow-y: scroll;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.75);
  z-index: 3;
}

.layout {
  display: flex;
  flex-grow: 1;
}

.content {
  flex-grow: 1;
}

.site-burger-btn {
  padding-left: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;

  & .icon {
    color: var(--black-color);
  }
}

.spacer {
  margin: auto;
}

.sidebar {
  position: relative;
  background: var(--sidebar-bg-color);
  z-index: 2;
}

.site-logo {
  margin-left: 18px;
  align-self: center;
  user-select: none;
}

.feed-loader {
  padding: 20px;
  max-width: 640px;
  background: var(--entry-bg-color);
  color: var(--black-color);
  border-radius: 8px;
  user-select: none;
}

.img-wrapp {
  overflow: hidden;

  & img {
    width: 100%;
    display: block;
  }
}

.video-wrapp {
  position: relative;
  z-index: 1;
}

.video,
.video__pseudo-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center center;
  cursor: pointer;

  & .icon {
    transition: fill-opacity 0.15s, color 0.15s;
    z-index: 1;
  }

  & .default-icon {
    width: 48px;
    height: 48px;
    fill-opacity: 0.6;
  }

  & .youtube-icon {
    color: rgba(31, 31, 30, 0.81);
  }

  & .coub-icon {
    width: 90px;
    height: 90px;
    color: rgba(0, 0, 0, 0.6);
  }
}

.video__pseudo-player {
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.embed-text,
.entry-content-subtitle {
  & a {
    color: var(--blue-color);
    cursor: pointer;
  }
}

.embed {
  display: flex;
  flex-flow: column;
  border: 1px solid var(--embed-border-color);
  border-radius: 8px;
  line-height: normal;
  overflow: hidden;

  & + .embed {
    margin-top: 12px;
  }

  & + .entry-content__cover {
    margin-top: 15px;
  }
}

.embed-header {
  margin: 15px 20px;
  display: flex;
  align-items: center;

  &__data {
    margin-left: 10px;

    & .date-time {
      margin-top: 3px;
      font-size: 13px;
      color: var(--grey-color);
    }
  }

  &__author-name {
    font-size: 16px;
    font-weight: 700;
  }

  &__author-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  &__author-tag {
    margin-left: 10px;
    font-size: 15px;
    color: var(--grey-color);
  }

  &__logo {
    align-self: flex-start;

    & .telegram-logo,
    .twitter-logo {
      width: 20px;
      height: 20px;
    }

    & .twitter-logo {
      fill: #1d9bf0;
    }
  }
}

.embed-text {
  margin: 0 20px 15px;
  font-size: 18px;
  line-height: 26px;

  & b {
    font-weight: 400;
  }

  & i {
    font-style: normal;
  }
}

.embed-cover {
  background-color: #333;

  & img {
    margin: 0 auto;
    max-width: 100%;
    max-height: 600px;
    display: block;
  }

  &_video {
    margin: 0 auto;
  }
}

@media (hover: hover) {
  .embed-text,
  .entry-content-subtitle {
    & a:hover {
      color: var(--red-color);
    }
  }

  .video__pseudo-player {
    &:hover {
      & .default-icon {
        fill-opacity: 0.8;
      }

      & .youtube-icon {
        color: #ff0000;
      }

      & .coub-icon {
        color: #0332ff;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  :root {
    --entry-cover-gap: 0 15px;
  }

  .site-logo {
    margin-left: 16px;
  }

  .sidebar {
    width: 100%;
    height: 100%;
  }

  .site-burger-btn {
    padding-left: 15px;
  }

  .embed-header {
    margin: 15px 15px;
  }

  .embed-text {
    margin: 0 15px 15px;
  }

  .cover {
    &.cover_vertical {
      padding: 0 15px;

      &.cover_highlighted {
        & > div {
          max-width: 75% !important;
        }
      }
    }

    &.cover_highlighted {
      padding: 30px;
    }
  }

  .feed-loader {
    border-radius: 0;
  }
}
</style>
