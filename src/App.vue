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
@import "normalize.css";
@import "roboto.css";
@import "../node_modules/nprogress/nprogress.css";

:root {
  --brand-color: #e5a040;
  --grey-color: #595959;
  --blue-color: #3766a9;
  --green-color: #07a23b;
  --red-color: #e92a40;
  --bg-color: #f2f2f2;
  --header-bg-color: #fff4e2;
  --sidebar-bg-color: var(--bg-color);
  --entry-bg-color: #fff;
  --highlight-block-color: #fffaf1;
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
  margin: 0 !important;
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

/* .cover.cover_vertical {
  padding: 0 25px;
} */

.cover.cover_wide {
  width: 100%;
}

.cover_vertical > div {
  margin: 0 auto;
  max-width: 55% !important;
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
    color: #3766a9;
    border-bottom: 1px solid #bed0ea;
    cursor: pointer;
  }
}

@media (hover: hover) {
  .embed-text,
  .entry-content-subtitle {
    & a:hover {
      color: #cd192e;
      border-bottom: 1px solid #f6b4bc;
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
    margin: 15px 15px 0;
  }

  .embed-text {
    margin: 10px 15px 15px;
  }
}

@media screen and (min-width: 768px) {
  .sidebar-tint {
    display: none;
  }
}
</style>
