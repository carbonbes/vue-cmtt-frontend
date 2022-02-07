<template>
  <nav class="left-sidebar" :class="classObject">
    <div class="sidebar">
      <div class="left-sidebar__header">
        <div class="left-sidebar__item">
          <div class="site-burger-btn" @click="visibilityToggler">
            <menu-icon class="icon" width="24" height="24" />
          </div>
        </div>
        <router-link class="left-sidebar__item site-logo" to="/"
          ><site-logo
        /></router-link>
      </div>
      <div class="left-sidebar__link-list">
        <router-link
          class="left-sidebar__link"
          active-class="left-sidebar__link_active"
          to="/"
          @click="savedSorting('hotness')"
          ><hot-icon class="icon" />Популярное</router-link
        >
        <router-link
          class="left-sidebar__link"
          active-class="left-sidebar__link_active"
          to="/new"
          @click="savedSorting('date')"
          ><clock-icon class="icon" />Свежее</router-link
        >
      </div>
    </div>
    <div class="sidebar-tint" />
  </nav>
</template>

<script>
import SiteLogo from "@/assets/logos/site_logo.svg?inline";
import HotIcon from "@/assets/logos/hot_icon.svg?inline";
import ClockIcon from "@/assets/logos/clock_icon.svg?inline";
import MenuIcon from "@/assets/logos/burger_icon.svg?inline";

export default {
  components: {
    SiteLogo,
    MenuIcon,
    HotIcon,
    ClockIcon,
  },

  data() {
    return {
      isVisibled: null,
      isMobile: null,
    };
  },

  methods: {
    visibilityToggler() {
      this.isVisibled = !this.isVisibled;
    },

    savedSorting(sorting) {
      localStorage.setItem("saved-sorting", sorting);
    },

    visibility(e) {
      if (e.matches) {
        this.isVisibled = false;
      } else {
        this.isVisibled = true;
      }
    },
  },

  computed: {
    classObject() {
      return {
        "left-sidebar_hidden": !this.isVisibled,
      };
    },
  },

  created() {
    this.isMobile = window.matchMedia("(max-width: 925px)");

    if (this.isMobile.matches) {
      this.isVisibled = false;
    } else {
      this.isVisibled = true;
    }
  },

  mounted() {
    this.emitter.on("left-sidebar-visibled", this.visibilityToggler);

    this.isMobile.addListener((e) => this.visibility(e));
  },

  beforeUnmount() {
    this.emitter.off("left-sidebar-visibled", this.visibilityToggler);

    this.isMobile.removeListener(() => this.visibility());
  },
};
</script>

<style lang="scss">
.left-sidebar {
  position: sticky;
  top: 60px;
  width: 220px;
  height: calc(100vh - 60px);
  flex-shrink: 0;
  z-index: 3;

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

@media screen and (max-width: 925px) {
  .left-sidebar {
    position: fixed;
    top: 0;
    width: 80%;
    max-width: 300px;
    height: 100%;
    background: var(--sidebar-bg-color);
  }

  .left-sidebar__header {
    height: 60px;
    display: flex;
  }

  .left-sidebar__item {
    display: flex;
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
    background: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }
}

@media (hover: hover) {
  .left-sidebar__link:hover {
    background: var(--left-sidebar-link-hover-color);
  }
}
</style>