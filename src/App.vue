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
    });

    onUnmounted(() => {
      socket.disconnect();
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

:root {
  --brand-color: #e5a040;
  --grey-color: #595959;
  --blue-color: #3766a9;
  --green-color: #07a23b;
  --red-color: #e92a40;
  --black-color: #000;
  --bg-color: #f2f2f2;
  --border-a: 0 0 0 1px #0000001a;
  --header-bg-color: #fff4e2;
  --sidebar-bg-color: var(--bg-color);
  --entry-bg-color: #fff;
  --entry-thin-cover-gap: 0 20px;
  --embed-border-color: #0000001a;
  --dropdown-bg-color: #fff;
  --dropdown-item-hover-bg-color: #f4f5f6;
  --dropdown-item-active-bg-color: #e3edfd;
  --link-block-bg-color: var(--embed-bg-color);
  --highlight-block-color: #fffaf1;
  --entry-block-highlight: #00000014;
  --left-sidebar-link-hover-color: #ffffff80;
  --active-item-color: #fff;
  --rating-button-hover: #0000000d;
  --loader-grey-color: #cacaca;
  --form-bg-color: #f5f5f5;
  --form-border-color: #e6e6e6;
  --form-border-color-hover: #bdd6fa;
  --form-border-color-active: #4683d9;
  --form-shadow: 0 0 0 3px rgb(70 131 217 / 12%);
  --embed-cover-bg: #00000014;
  --link-text-decoration-color: #bed0ea;
  --link-text-decoration-color-hover: #f6b4bc;
  --box-shadow-avatar: inset 0 0 0 1px #0000001a;
  --branch-color: #e6e6e6;
  --branch-collapse-btn-bg: #e4e4e480;
  --comment-self-author-badge: #e5a040;
  --comment-rating-value-wrapp-bg-positive: #eefbf3;
  --comment-rating-value-wrapp-bg-neutral: #5959591a;
  --comment-rating-value-wrapp-bg-negative: #fff1f1;
  --comment-highlight-bg: #fffaf1;
}

[data-theme="dark"] {
  --grey-color: #939393;
  --blue-color: #6794cc;
  --green-color: #5fb668;
  --red-color: #c2646d;
  --black-color: #efefef;
  --bg-color: #000;
  --border-a: 0 0 0 1px #ffffff25;
  --header-bg-color: #202020;
  --entry-bg-color: #151515;
  --embed-border-color: #303030;
  --dropdown-bg-color: #272727;
  --dropdown-item-hover-bg-color: #303030;
  --dropdown-item-active-bg-color: #353f4d;
  --highlight-block-color: #1d1d1d;
  --entry-block-highlight: #ffffff0a;
  --left-sidebar-link-hover-color: #1f1f1fbf;
  --active-item-color: #1e1e1e;
  --rating-button-hover: #ffffff0d;
  --loader-grey-color: #595959;
  --form-bg-color: #252525;
  --form-border-color: #303030;
  --form-border-color-hover: #3f597c;
  --form-border-color-active: #608eca;
  --form-shadow: 0 0 0 3px rgb(70 131 217 / 20%);
  --embed-cover-bg: #ffffff0a;
  --link-text-decoration-color: #3c434d;
  --link-text-decoration-color-hover: #503b3d;
  --box-shadow-avatar: inset 0 0 0 1px #ffffff1a;
  --branch-color: #353535;
  --branch-collapse-btn-bg: #2b2b2b80;
  --comment-self-author-badge: #d1924d;
  --comment-rating-value-wrapp-bg-positive: #468b6126;
  --comment-rating-value-wrapp-bg-neutral: #1d1d1d;
  --comment-rating-value-wrapp-bg-negative: #98484840;
  --comment-highlight-bg: #202020;
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
  height: 1.5px;
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
h6,
blockquote {
  margin: 0;
}

iframe {
  width: 100%;
  display: block;
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

  display: block;
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

  &:disabled {
    opacity: 0.7;
  }

  &_focused {
    background-color: transparent;
    border: 1px solid var(--form-border-color-active) !important;
    box-shadow: var(--form-shadow);
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

  &_disabled {
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

.vue-notification-group {
  top: 72px !important;
  cursor: pointer;

  /* & .notification {
    margin: 0 5px 5px;
    padding: 10px;
    font-size: 12px;
    color: #ffffff;
    border-left: 5px solid #187fe7;

    &-title {
      font-size: 14px;
    }

    &.success {
      background: #68cd86;
      border-left-color: #42a85f;
    }

    &.warn {
      background: #ffb648;
      border-left-color: #f48a06;
    }

    &.error {
      background: #e54d42;
      border-left-color: #b82e24;
    }
  } */
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
  min-width: 0;
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
  cursor: pointer;

  & .icon {
    transition: fill-opacity 0.15s, color 0.15s;
    z-index: 1;
  }

  & .default-icon {
    width: 48px;
    height: 48px;
    fill: #1f1f1eb5;
    transition: fill 0.15s;
  }

  & .youtube-icon {
    color: rgba(31, 31, 30, 0.81);
  }

  & .coub-icon {
    width: 90px;
    height: 90px;
    color: rgba(0, 0, 0, 0.6);
  }

  & .vimeo-icon {
    width: 66px;
    height: 40px;
    color: #172223bf;
  }
}

.video__pseudo-player {
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center center;

  &.default-player {
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }

  &.embed-player {
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
}

.embed-text,
.entry-content-subtitle,
.entry-page__text-block,
.profile-popup__description,
.quote-component__content .author .name,
.quote-component__content .author .description,
.entry-content__subtitle p,
.entry-page__comment .text {
  & a {
    color: var(--blue-color);
    border-bottom: 1px solid var(--link-text-decoration-color);
    cursor: pointer;
  }
}

.embed {
  position: relative;
  display: flex;
  flex-flow: column;
  border: 1px solid var(--embed-border-color);
  border-radius: 8px;
  line-height: normal;
  overflow: hidden;

  & + .embed {
    margin-top: 12px;
  }

  & + .link-block {
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
    overflow: hidden;

    & .date-time {
      display: inline-block;
      line-height: 20px;
      font-size: 13px;
      color: var(--grey-color);
    }
  }

  &__author-wrap {
    display: flex;
    align-items: center;
  }

  &__author-avatar {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
    background-size: cover;
  }

  &__author-name {
    overflow: hidden;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    font-weight: 500;
  }

  &__author-tag {
    margin-left: 10px;
    min-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    color: var(--grey-color);
  }

  &__logo {
    padding-left: 15px;
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

.embed-text__wrap {
  margin: 0 20px 15px;
  font-size: 17px;
  line-height: 26px;
}

.embed-text {
  & br {
    display: block;
    content: "";
    height: 4px;
  }

  &__collapsed-btn {
    margin-left: 5px;
    color: var(--blue-color);
    cursor: pointer;
  }

  & b {
    font-weight: 400;
  }

  & i {
    font-style: normal;
  }
}

.embed-cover {
  background-color: var(--embed-cover-bg);

  &_img {
    margin: 0 auto;
    max-width: 100%;
    max-height: 600px;
    display: block;
  }

  &_video {
    margin: 0 auto;
  }

  &_img + &_video {
    margin-top: 7px;
  }

  &_video + &_img {
    margin-top: 7px;
  }
}

.person-component {
  display: flex;
  flex-direction: column;
  align-items: center;

  & .avatar {
    margin-bottom: 15px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  & .name {
    font-weight: 500;
  }

  & .description {
    font-size: 15px;
  }
}

@media (hover: hover) {
  .embed-text,
  .entry-content-subtitle,
  .entry-page__text-block,
  .profile-popup__description,
  .quote-component__content .author .name,
  .quote-component__content .author .description,
  .entry-content__subtitle p,
  .entry-page__comment .text {
    & a {
      &:hover {
        color: var(--red-color);
        border-bottom: 1px solid var(--link-text-decoration-color-hover);
      }
    }
  }

  .embed-text__collapsed-btn {
    &:hover {
      color: var(--red-color);
    }
  }

  .video__pseudo-player {
    &:hover {
      & .default-icon {
        fill: #1f1f1ee6;
      }

      & .youtube-icon {
        color: #ff0000;
      }

      & .coub-icon {
        color: #0332ff;
      }

      & .vimeo-icon {
        color: #0faef1;
      }
    }
  }
}

@media screen and (max-width: 768px) {
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

    &__author-tag {
      min-width: 50px;
    }
  }

  .embed-text__wrap {
    margin: 0 15px 15px;
  }

  .quote-component {
    &__content {
      max-width: 225px;
    }
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

  .person-component {
    & .avatar {
      margin-bottom: 5px;
      width: 100px;
      height: 100px;
    }

    & .description {
      font-size: 14px;
    }
  }
}

@keyframes rating-anim-up-enter {
  0% {
    opacity: 0;
    transform: translateY(-12.5px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rating-anim-up-leave {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(12.5px);
  }
}

@keyframes rating-anim-down-enter {
  0% {
    opacity: 0;
    transform: translateY(12.5px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rating-anim-down-leave {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-12.5px);
  }
}

@media screen and (max-width: 1219px) {
  [data-theme="dark"] {
    --sidebar-bg-color: #202020;
    --active-item-color: #303030;
    --left-sidebar-link-hover-color: #272727;
  }
}
</style>
