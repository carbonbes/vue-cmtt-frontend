<template>
  <header class="header">
    <div class="header__item" @click="leftSidebarVisibility">
      <div class="site-burger-btn"><menu-icon class="icon" /></div>
    </div>
    <router-link class="header__item" to="/"
      ><site-logo class="site-logo"
    /></router-link>
    <div class="spacer"></div>
    <div class="header__item" @click="toggleTheme">
      <div class="header__item-theme-toggle-btn">
        <sun-icon class="icon" v-if="this.currentTheme" />
        <moon-icon class="icon" v-else />
      </div>
    </div>
    <div class="header__item">
      <div class="header__item-bell-btn"><bell-icon class="icon" /></div>
    </div>
    <div class="header__item">
      <div class="header__item-login-btn" v-if="!isAuth">
        <user-icon class="icon" />
      </div>
      <div class="header__item-avatar-wrapp" v-if="isAuth">
        <div class="header__item-avatar" :style="avatarStyleObject" />
      </div>
    </div>
    <div class="loader" />
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { SunIcon, MoonIcon } from "@zhuowenli/vue-feather-icons";
import MenuIcon from "@/assets/logos/burger_icon.svg?inline";
import SiteLogo from "@/assets/logos/site_logo.svg?inline";
import BellIcon from "@/assets/logos/bell_icon.svg?inline";
import UserIcon from "@/assets/logos/user_icon.svg?inline";

export default {
  components: {
    MenuIcon,
    BellIcon,
    UserIcon,
    SunIcon,
    MoonIcon,
    SiteLogo,
  },

  inject: ["currentTheme"],

  methods: {
    leftSidebarVisibility() {
      this.emitter.emit("left-sidebar-visibled");
    },

    toggleTheme() {
      this.emitter.emit("theme-toggle");
    },
  },

  computed: {
    ...mapGetters(["auth"]),

    isAuth() {
      return this.auth.length !== 0;
    },

    avatarStyleObject() {
      if (this.auth.avatar) {
        return {
          backgroundImage: `url(
            https://leonardo.osnova.io/${this.auth.avatar.data.uuid}/-/format/webp/
          )`,
        };
      }
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
  z-index: 3;
}

.header__item {
  display: flex;
  flex-shrink: 0;
}

.header__item-bell-btn,
.header__item-login-btn,
.header__item-theme-toggle-btn {
  margin-left: 5px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  cursor: pointer;

  & .icon {
    color: var(--black-color);
    stroke-width: 2.25;
  }
}

.header__item-theme-toggle-btn {
  & .icon {
    width: 28px;
    height: 24px;
  }
}

.header__item-login-btn {
  padding-right: 40px;

  & .icon {
    margin-right: 8px;
  }
}

.header__item-avatar-wrapp {
  margin-left: 5px;
  padding: 12px;
  padding-right: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header__item-avatar {
  width: 40px;
  height: 40px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
  border-radius: 8px;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
}

@media screen and (max-width: 768px) {
  .header__item-bell-btn,
  .header__item-login-btn,
  .header__item-theme-toggle-btn {
    margin-left: 0px;
  }

  .header__item-login-btn {
    & .icon {
      margin-right: 0px;
    }
  }

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
        opacity: 0.7;
      }
    }
  }

  .header__item-bell-btn,
  .header__item-login-btn,
  .header__item-theme-toggle-btn {
    &:hover {
      .icon {
        color: var(--brand-color);
      }
    }
  }

  .header__item-avatar-wrapp {
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>