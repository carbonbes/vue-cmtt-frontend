<template>
  <header class="header">
    <div class="header__item">
      <div class="site-burger-btn" @click="leftSidebarVisibility">
        <menu-icon class="icon" />
      </div>
    </div>
    <router-link class="header__item" to="/"
      ><site-logo class="site-logo"
    /></router-link>
    <div class="spacer"></div>
    <div class="header__item">
      <div
        class="header__item-theme-toggle-btn"
        @click="toggleTheme"
        v-if="!isAuthRequested"
      >
        <sun-icon class="icon" v-if="this.currentTheme" />
        <moon-icon class="icon" v-else />
      </div>
    </div>
    <div
      class="header__item bell-btn"
      v-outside-click:[true]="closeNotificationsPopup"
    >
      <div
        class="header__item-bell-btn"
        :class="bellBtnClassObj"
        @click="toggleNotificationsPopup"
        v-if="!isAuthRequested"
      >
        <bell-icon class="icon" />
        <div
          class="badge"
          v-if="this.notificationsCount > 0"
          v-text="this.notificationsCount"
        ></div>
      </div>
      <notifications
        :close="closeNotificationsPopup"
        v-if="notificationsVisible"
      />
    </div>
    <div class="header__item">
      <div
        class="header__item-login-btn"
        @click="toggleShowLoginModal"
        v-if="!isAuth && !isAuthRequested"
      >
        <user-icon class="icon" />
      </div>
      <div
        class="header__item-profile-wrapp"
        @touchstart="openDropdown"
        v-if="isAuth"
      >
        <div class="header__item-avatar-wrapp">
          <div class="header__item-avatar icon" :style="avatarStyleObject" />
        </div>
        <div
          class="header__item-avatar-more-wrapp"
          :class="moreButtonClassObject"
          @click="toggleDrowdownVisible"
        >
          <chevron-down class="header__item-avatar-more icon" />
          <dropdown
            v-if="dropdownVisible"
            v-outside-click:[true]="closeDropdown"
          />
        </div>
      </div>
    </div>
    <div class="loader" />
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import MoonIcon from "@/assets/logos/moon_icon.svg?inline";
import SunIcon from "@/assets/logos/sun_icon.svg?inline";
import MenuIcon from "@/assets/logos/burger_icon.svg?inline";
import SiteLogo from "@/assets/logos/site_logo.svg?inline";
import BellIcon from "@/assets/logos/bell_icon.svg?inline";
import UserIcon from "@/assets/logos/user_icon.svg?inline";
import ChevronDown from "@/assets/logos/chevron-down_icon.svg?inline";
import Dropdown from "./Dropdown.vue";
import Notifications from "./Notifications/Notifications.vue";
import notifySound from "@/assets/sounds/notify.mp3";

export default {
  setup() {
    const audioFile = new Audio(notifySound);

    return { audioFile };
  },

  components: {
    MenuIcon,
    BellIcon,
    UserIcon,
    SunIcon,
    MoonIcon,
    SiteLogo,
    ChevronDown,
    Dropdown,
    Notifications,
  },

  inject: ["currentTheme"],

  data() {
    return {
      dropdownVisible: false,
      notificationsVisible: false,
    };
  },

  methods: {
    leftSidebarVisibility() {
      this.emitter.emit("left-sidebar-visibled");
    },

    toggleTheme() {
      this.emitter.emit("theme-toggle");
    },

    toggleShowLoginModal() {
      this.emitter.emit("login-modal-toggle");
    },

    toggleDrowdownVisible() {
      this.dropdownVisible = !this.dropdownVisible;
    },

    openDropdown() {
      this.dropdownVisible = true;
    },

    closeDropdown() {
      this.dropdownVisible = false;
    },

    toggleNotificationsPopup() {
      this.notificationsVisible = !this.notificationsVisible;
    },

    closeNotificationsPopup() {
      this.notificationsVisible = false;
    },
  },

  watch: {
    unreadNotifications(newValue, oldValue) {
      if (newValue) {
        this.audioFile.volume = 0.25;
        this.audioFile.play();
      }
    },
  },

  computed: {
    bellBtnClassObj() {
      return {
        "header__item-bell-btn_pressed": this.notificationsVisible,
      };
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

    moreButtonClassObject() {
      return {
        "header__item-avatar-more-wrapp_active": this.dropdownVisible,
      };
    },

    ...mapGetters([
      "auth",
      "isAuth",
      "isAuthRequested",
      "notificationsCount",
      "unreadNotifications",
    ]),
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
  z-index: 4;
}

.header__item {
  position: relative;
  display: flex;
  flex-shrink: 0;
}

.header__item-bell-btn,
.header__item-login-btn,
.header__item-theme-toggle-btn {
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

.header__item-bell-btn {
  &_pressed {
    & .icon {
      color: var(--brand-color);
    }
  }

  & .badge {
    position: absolute;
    top: 15%;
    left: 50%;
    padding: 3px 5px;
    min-width: 12px;
    display: inline-block;
    background-color: #e62e3b;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1em;
    font-weight: 500;
  }
}

.header__item-login-btn {
  padding-right: 40px;

  & .icon {
    margin-right: 8px;
  }
}

.header__item-profile-wrapp {
  display: flex;
}

.header__item-avatar-wrapp {
  padding: 0 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header__item-avatar {
  width: 40px;
  height: 40px;
  box-shadow: var(--box-shadow-avatar);
  border-radius: 8px;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
}

.header__item-avatar-more-wrapp {
  position: relative;
  margin-right: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &_active {
    &::before {
      content: "";
      position: absolute;
      width: 10px;
      height: 10px;
      left: 25%;
      bottom: -5px;
      background: var(--dropdown-bg-color);
      transform: rotate(45deg);
      box-shadow: -1px -1px 0 0 rgb(0 0 0 / 7%);
      z-index: 1;
    }
  }
}

.header__item-avatar-more {
  width: 18px;
  height: 18px;
  align-self: center;
  color: var(--black-color);
}

@media screen and (max-width: 768px) {
  .header__item-avatar-more-wrapp {
    display: none;
  }

  .header__item-bell-btn,
  .header__item-login-btn,
  .header__item-theme-toggle-btn,
  .header__item-avatar-wrapp {
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

  .header__item-login-btn,
  .header__item-avatar-wrapp {
    padding-right: 15px;
  }

  .header__item.bell-btn {
    position: unset;
  }
}

@media (hover: hover) {
  .header__item-avatar-wrapp {
    &:hover {
      .icon {
        opacity: 0.8;
      }
    }
  }

  .site-burger-btn,
  .header__item-avatar-more-wrapp {
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
}
</style>