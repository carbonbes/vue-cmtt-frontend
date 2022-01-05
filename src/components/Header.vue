<template>
  <header class="header">
    <div class="header__item" @click="leftSidebarVisibility">
      <div class="site-burger-btn"><menu-icon class="icon" /></div>
    </div>
    <router-link class="header__item site-logo" to="/">Т///</router-link>
    <div class="spacer"></div>
    <div class="header__item">
      <div class="header__item-bell-btn"><bell-icon class="icon" /></div>
    </div>
    <div class="header__item">
      <div class="header__item-login-btn">
        <log-in-icon class="icon" />
      </div>
    </div>
  </header>
</template>

<script>
import { MenuIcon, BellIcon, LogInIcon } from "@zhuowenli/vue-feather-icons";

export default {
  components: {
    MenuIcon,
    BellIcon,
    LogInIcon,
  },

  methods: {
    leftSidebarVisibility() {
      this.emitter.emit("left-sidebar-visibled");
    },
  },
};
</script>

<style lang="scss">
.header {
  position: sticky !important;
  top: 0;
  width: 100%;
  height: 60px;
  display: flex;
  background: var(--header-bg-color);
  z-index: 2;
}

.header__item {
  display: flex;
  flex-shrink: 0;
}

.header__item-bell-btn,
.header__item-login-btn {
  padding: 0 12px;
  display: flex;
  align-items: center;
  cursor: pointer;

  & .icon {
    width: 24px;
    height: 24px;
    stroke-width: 2.25;
  }
}

.header__item-login-btn {
  & .icon {
    margin-right: 8px;
  }
}

.header__item-login-btn {
  margin-left: 5px;
  padding-right: 40px;
}

@media screen and (max-width: 768px) {
  .header__item-bars-btn {
    padding-left: 20px;
  }

  .header__item-login-btn {
    padding-right: 15px;
  }
}

@media (hover: hover) {
  .site-burger-btn {
    &:hover {
      .icon {
        color: var(--grey-color);
      }
    }
  }

  .header__item-bell-btn,
  .header__item-login-btn {
    &:hover {
      .icon {
        color: var(--brand-color);
      }
    }
  }
}
</style>