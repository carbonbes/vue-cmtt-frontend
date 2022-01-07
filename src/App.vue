<template>
  <Header />
  <div class="layout">
    <LeftSidebar />
    <main class="content"><router-view /></main>
    <RightSidebar />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
import RightSidebar from "@/components/RightSidebar.vue";

export default {
  components: {
    Header,
    LeftSidebar,
    RightSidebar,
  },

  methods: {
    toggleTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
    },
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
  --embed-bg-color: #f5f5f5;
  --embed-border-color: #0000001a;
  --highlight-block-color: #fffaf1;
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
  --embed-bg-color: #242424;
  --embed-border-color: #303030;
  --highlight-block-color: #242424;
}

* {
  box-sizing: border-box;
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

body {
  margin: 0;
  font-family: "Roboto", sans-serif;
  background: var(--bg-color);
  overflow-y: scroll;
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
  color: var(--black-color);
  cursor: pointer;
}

.spacer {
  margin: auto;
}

.icon {
  width: 24px;
  height: 24px;
}

.sidebar {
  position: relative;
  background: var(--sidebar-bg-color);
  z-index: 2;
}

.sidebar-tint {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.site-logo {
  margin-left: 18px;
  color: var(--black-color);
  font-weight: 900;
  font-size: 2rem;
  line-height: 60px;
  user-select: none;
}

.img-wrapp {
  overflow: hidden;
}

.img-wrapp img {
  width: 100%;
  display: block;
}

.video-wrapp {
  position: relative;
  z-index: 1;
}

.video {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
}

.cover.cover_thin {
  padding: 0 25px;
}

.cover.cover_wide {
  width: 100%;
}

.cover_vertical {
  padding: 0 25px;

  & > div {
    max-width: 55% !important;
  }
}

.cover_highlighted {
  padding: 30px;
  background: var(--highlight-block-color);
}

.cover_highlighted > div {
  margin: 0 auto;
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
  background: var(--embed-bg-color);
  border: 1px solid var(--embed-border-color);
  border-radius: 8px;
  line-height: normal;

  &:first-child {
    margin-top: 5px;
  }

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
}

.embed-header__data {
  margin-left: 10px;

  & .date-time {
    font-size: 13px;
    color: var(--grey-color);
  }
}

.embed-header__author-name {
  font-weight: 700;
}

.embed-header__author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.embed-header__author-tag {
  margin-left: 10px;
  font-size: 15px;
  color: var(--grey-color);
}

.embed-header__logo {
  & .telegram-logo,
  .twitter-logo {
    width: 24px;
    height: 24px;
  }

  & .twitter-logo {
    fill: #1d9bf0;
  }
}

.embed-text {
  margin: 0 20px 20px;
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
  & img,
  video {
    width: 100%;
    display: block;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  & video {
    max-height: 600px;
    background: var(--grey-color);
    cursor: pointer;
  }
}

@media (hover: hover) {
  .embed-text,
  .entry-content-subtitle {
    & a:hover {
      color: var(--red-color);
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
  }

  .embed-text {
    margin: 0 15px 15px;
  }

  .cover_vertical {
    & > div {
      max-width: 75% !important;
    }
  }
}

@media screen and (min-width: 768px) {
  .sidebar-tint {
    display: none;
  }
}
</style>
