<template>
  <nav
    class="left-sidebar"
    :class="sidebarClassObj"
    v-scroll-lock:[isMobile]="state.sidebarVisibled"
  >
    <div class="sidebar" v-outside-click:[isMobile]="sidebarHide">
      <div class="left-sidebar__header">
        <div class="left-sidebar__item">
          <div class="site-burger-btn" @click="sidebarVisibilityToggle">
            <menu-icon class="icon" width="24" height="24" />
          </div>
        </div>
        <router-link class="left-sidebar__item" to="/"
          ><div class="site-logo"><SiteLogo class="icon" /></div
        ></router-link>
        <div class="spacer"></div>
        <div class="left-sidebar__item" @click="toggleTheme">
          <div class="theme-toggle-btn">
            <SunIcon class="icon" v-if="currentTheme" />
            <MoonIcon class="icon" v-else />
          </div>
        </div>
      </div>
      <div class="left-sidebar__link-list" v-if="!isAuthRequested">
        <router-link
          class="left-sidebar__link"
          :class="sidebarPopularBtnClassObj"
          to="/popular"
          @click="
            saveFeedSettings({
              pageName: 'popular'/* ,
              popularFeedSorting: 'hotness', */
            })
          "
          ><HotIcon class="icon" />Популярное</router-link
        >
        <router-link
          class="left-sidebar__link"
          :class="sidebarNewBtnClassObj"
          to="/new"
          @click="
            saveFeedSettings({ pageName: 'new'/* , newFeedSorting: 'from-10' */ })
          "
        >
          <ClockIcon class="icon" />Свежее
        </router-link>
        <router-link
          class="left-sidebar__link"
          :class="sidebarMyFeedBtnClassObj"
          to="/my"
          @click="
            saveFeedSettings({ pageName: 'my'/* , myFeedSorting: 'hotness' */ })
          "
          v-if="myFeedBtnVisibility"
        >
          <MyFeedIcon class="icon" />Моя лента
        </router-link>
      </div>
    </div>
    <div class="sidebar-tint" />
  </nav>
</template>

<script setup>
import {
  reactive,
  markRaw,
  computed,
  watch,
  onBeforeMount,
  onBeforeUnmount,
  inject,
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useMediaQuery } from "@vueuse/core";
import MenuIcon from "@/assets/logos/burger_icon.svg?inline";
import SiteLogo from "@/assets/logos/site_logo.svg?inline";
import HotIcon from "@/assets/logos/hot_icon.svg?inline";
import ClockIcon from "@/assets/logos/clock_icon.svg?inline";
import MyFeedIcon from "@/assets/logos/my_feed_icon.svg?inline";
import MoonIcon from "@/assets/logos/moon_icon.svg?inline";
import SunIcon from "@/assets/logos/sun_icon.svg?inline";

const store = useStore();
const emitter = inject("emitter");
const currentTheme = inject("currentTheme");
const route = useRoute();
const isMobile = useMediaQuery("(max-width: 1219px)");
const allPopularFeedRoutes = markRaw([
  "/popular",
  "/popular/hotness",
  "/popular/day",
  "/popular/week",
  "/popular/month",
  "/popular/year",
  "/popular/all",
]);
const allNewFeedRoutes = markRaw([
  "/new",
  "/new/from-10",
  "/new/from5",
  "/new/from10",
  "/new/all",
]);
const myFeedRoutes = markRaw(["/my", "/my/new", "/my/popular"]);

// state
const state = reactive({
  sidebarVisibled: null,
});

// methods
const sidebarVisibilityToggle = () => {
  state.sidebarVisibled = !state.sidebarVisibled;
};

const sidebarHide = () => {
  state.sidebarVisibled = false;
};

const saveFeedSettings = (data) => {
  localStorage.setItem("pageName", data.pageName);
  if (data.popularFeedSorting) {
    localStorage.setItem("popularFeedSorting", data.popularFeedSorting);
  } else if (data.newFeedSorting) {
    localStorage.setItem("newFeedSorting", data.newFeedSorting);
  } else if (data.myFeedSorting) {
    localStorage.setItem("myFeedSorting", data.myFeedSorting);
  }
};

const toggleTheme = () => {
  emitter.emit("theme-toggle");
};

// computed
const sidebarClassObj = computed(() => ({
  "left-sidebar_hidden": !state.sidebarVisibled,
}));

const sidebarPopularBtnClassObj = computed(() => {
  if (allPopularFeedRoutes.includes(route.path)) {
    return "left-sidebar__link_active";
  }
});

const sidebarNewBtnClassObj = computed(() => {
  if (allNewFeedRoutes.includes(route.path)) {
    return "left-sidebar__link_active";
  }
});

const sidebarMyFeedBtnClassObj = computed(() => {
  if (myFeedRoutes.includes(route.path)) {
    return "left-sidebar__link_active";
  }
});

const myFeedBtnVisibility = computed(() => {
  if (!isAuth.value) {
    return false;
  } else return true;
});

const isAuth = computed(() => store.getters.isAuth);

const isAuthRequested = computed(() => store.getters.isAuthRequested);

// watch
watch(
  () => isMobile.value,
  () => {
    if (isMobile.value) {
      state.sidebarVisibled = false;
    } else {
      state.sidebarVisibled = true;
    }
  }
);

// before mount
onBeforeMount(() => {
  if (isMobile.value) {
    state.sidebarVisibled = false;
  } else {
    state.sidebarVisibled = true;
  }

  emitter.on("left-sidebar-visibled", sidebarVisibilityToggle);
  emitter.on("left-sidebar-hide", sidebarHide);
});

// before unmount
onBeforeUnmount(() => {
  emitter.off("left-sidebar-visibled", sidebarVisibilityToggle);
  emitter.off("left-sidebar-hide", sidebarHide);
});
</script>

<style lang="scss">
.left-sidebar {
  position: sticky;
  top: 60px;
  width: 220px;
  height: calc(100vh - 60px);
  flex-shrink: 0;
  z-index: 4;

  &_hidden {
    display: none;
  }
}

.left-sidebar__header {
  display: none;
}

.left-sidebar__link-list {
  margin: 12px 10px;
  display: flex;
  flex-flow: column;
}

.left-sidebar__link {
  margin-bottom: 3px;
  padding: 0 13px;
  height: 44px;
  display: flex;
  align-items: center;
  color: var(--black-color);
  border-radius: 8px;
  user-select: none;
}

.left-sidebar__link {
  & .icon {
    margin-right: 12px;
    color: var(--grey-color);
  }

  &_active {
    background: var(--active-item-color) !important;

    & .icon {
      color: var(--brand-color);
    }
  }
}

.left-sidebar__item {
  display: flex;
  align-items: center;
  cursor: pointer;

  & > .theme-toggle-btn {
    padding: 0 15px;

    & .icon {
      width: 30px;
      height: 26px;
      color: var(--black-color);
      stroke-width: 2.25;
    }
  }
}

@media (max-width: 1219px) {
  .left-sidebar {
    position: fixed;
    top: 0;
    width: 80%;
    max-width: 300px;
    height: 100%;
    background: var(--sidebar-bg-color);

    & .sidebar {
      height: 100%;
    }
  }

  .left-sidebar__header {
    height: 60px;
    display: flex;
  }

  .left-sidebar__item {
    display: flex;

    & > .site-burger-btn,
    & > .site-logo {
      display: flex;

      & .icon {
        margin-left: 20px;
        align-self: center;
        color: var(--black-color);
      }
    }
  }

  .left-sidebar__link {
    height: 48px;
    font-size: 18px;
  }

  .sidebar-tint {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
}

@media (min-width: 769px) {
  .left-sidebar__item.theme-toggle-btn {
    display: none;
  }
}

@media (max-width: 769px) {
  .left-sidebar__item {
    & > .site-burger-btn {
      & .icon {
        margin-left: 15px;
      }
    }
  }
}

@media (hover: hover) {
  .left-sidebar__link:hover {
    background: var(--left-sidebar-link-hover-color);
  }

  .left-sidebar__item.theme-toggle-btn {
    &:hover {
      & .icon {
        color: var(--brand-color);
      }
    }
  }
}
</style>