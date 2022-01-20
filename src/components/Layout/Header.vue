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
      <div class="header__item-login-btn">
        <user-icon class="icon" />
      </div>
    </div>
    <div class="loader" />
  </header>
</template>

<script>
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

  data() {
    return {
      currentTheme: null,
      timeout: null,
    };
  },

  methods: {
    leftSidebarVisibility() {
      this.emitter.emit("left-sidebar-visibled");
    },

    toggleTheme() {
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
  },

  created() {
    let theme = localStorage.getItem("theme");

    if (theme === "light" || !theme) {
      this.currentTheme = false;
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      this.currentTheme = true;
      document.documentElement.setAttribute("data-theme", "dark");
    }
  },

  beforeUnmount() {
    clearTimeout(this.timeout);
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
  & .icon {
    margin-right: 8px;
  }
}

.header__item-login-btn {
  padding-right: 40px;
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
        opacity: 0.5;
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
}
</style>