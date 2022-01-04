<template>
  <nav class="left-sidebar" :class="classObject">
    <div
      class="sidebar"
      v-outside-click="{
        ignore: this.ignoredOutsideClick,
        emitterName: 'left-sidebar-visible',
      }"
    >
      <div class="left-sidebar__header">
        <div class="left-sidebar__item" @click="visibilityToggler">
          <div class="site-burger-btn">
            <menu-icon class="icon" width="24" height="24" />
          </div>
        </div>
        <router-link class="left-sidebar__item site-logo" to="/"
          >Т///</router-link
        >
      </div>
      <div class="left-sidebar__link-list">
        <router-link
          class="left-sidebar__link"
          active-class="left-sidebar__link_active"
          to="/"
          ><zap-icon class="icon" />Популярное</router-link
        >
        <router-link
          class="left-sidebar__link"
          active-class="left-sidebar__link_active"
          to="/new"
          ><clock-icon class="icon" />Свежее</router-link
        >
      </div>
    </div>
    <div class="sidebar-tint" />
  </nav>
</template>

<script>
import { ZapIcon, ClockIcon, MenuIcon } from "@zhuowenli/vue-feather-icons";

export default {
  data() {
    return {
      isVisibled: null,
      ignoredOutsideClick: null,
    };
  },

  components: {
    ZapIcon,
    ClockIcon,
    MenuIcon,
  },

  methods: {
    visibilityToggler() {
      this.isVisibled = !this.isVisibled;
    },

    visibilityToggle() {
      this.isVisibled = false;
    },

    onResize() {
      this.isVisibled =
        document.documentElement.clientWidth < 768 ? false : true;
      this.ignoredOutsideClick =
        document.documentElement.clientWidth < 768 ? false : true;
    },
  },

  computed: {
    classObject: function () {
      return {
        "left-sidebar_hidden": !this.isVisibled,
      };
    },
  },

  created() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  },

  mounted() {
    this.emitter.on("left-sidebar-visibled", this.visibilityToggler);
    this.emitter.on("left-sidebar-visible", this.visibilityToggle);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
    this.emitter.off("left-sidebar-visibled", this.visibilityToggler);
    this.emitter.on("left-sidebar-visible", this.visibilityToggle);
  },
};
</script>

<style>
.left-sidebar {
  position: sticky;
  top: 60px;
  width: 220px;
  height: calc(100vh - 60px);
  flex-shrink: 0;
  z-index: 2;
}

.left-sidebar_hidden {
  display: none;
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
  border-radius: 8px;
  user-select: none;
}

.left-sidebar__link .icon {
  width: 22px;
  height: 22px;
  margin-right: 12px;
  color: var(--grey-color);
}

.left-sidebar__link_active {
  background: #fff !important;
}

.left-sidebar__link_active .icon {
  color: var(--brand-color);
}

@media screen and (max-width: 768px) {
  .left-sidebar {
    position: fixed;
    top: 0;
    width: 80%;
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

  .left-sidebar__link .icon {
    width: 24px;
    height: 24px;
  }
}

@media (hover: hover) {
  .left-sidebar__link:hover {
    background: #ffffff99;
  }
}
</style>