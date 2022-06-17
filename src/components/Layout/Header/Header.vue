<script>
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import MoonIcon from "@/assets/logos/moon_icon.svg?inline";
import SunIcon from "@/assets/logos/sun_icon.svg?inline";
import MenuIcon from "@/assets/logos/burger_icon.svg?inline";
import SiteLogo from "@/assets/logos/site_logo.svg?inline";
import BellIcon from "@/assets/logos/bell_icon.svg?inline";
import UserIcon from "@/assets/logos/user_icon.svg?inline";
import ChevronDown from "@/assets/logos/chevron-down_icon.svg?inline";
import PencilIcon from "@/assets/logos/pencil_icon.svg?inline";
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
    PencilIcon,
    Dropdown: defineAsyncComponent(() => import("./Dropdown.vue")),
    Notifications: defineAsyncComponent(() =>
      import("./Notifications/Notifications.vue")
    ),
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
        this.audioFile.play();
      }
    },
  },

  computed: {
    bellBtnClassObj() {
      return {
        "bell-btn_pressed": this.notificationsVisible,
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

    currentUserId() {
      return this.auth.id;
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

<template>
  <header class="header">
    <div class="header__item">
      <div class="burger-btn" @click="leftSidebarVisibility">
        <MenuIcon class="icon" />
      </div>
    </div>

    <router-link class="header__item" to="/">
      <div class="logo-btn"><SiteLogo class="logo" /></div>
    </router-link>

    <div class="spacer"></div>

    <div class="header__item">
      <button
        class="entry-create-btn button button_a"
        @click="this.emitter.emit('editor-modal-toggle')"
        v-if="isAuth && !isAuthRequested"
      >
        <PencilIcon class="icon" />
        <span class="button__label">Новая запись</span>
      </button>
    </div>

    <div class="header__item">
      <div
        class="theme-toggle-btn"
        @click="toggleTheme"
        v-if="!isAuthRequested"
      >
        <SunIcon class="icon" v-if="this.currentTheme" />
        <MoonIcon class="icon" v-else />
      </div>
    </div>

    <div
      class="header__item notifications"
      v-outside-click:[true]="closeNotificationsPopup"
    >
      <div
        class="bell-btn"
        :class="bellBtnClassObj"
        @click="toggleNotificationsPopup"
        v-if="!isAuthRequested"
      >
        <BellIcon class="icon" />
        <div
          class="badge us-none"
          v-if="this.notificationsCount > 0"
          v-text="this.notificationsCount"
        ></div>
      </div>
      <transition name="header__notifications">
        <Notifications
          :close="closeNotificationsPopup"
          v-if="notificationsVisible"
        />
      </transition>
    </div>

    <div class="header__item" v-outside-click:[true]="closeDropdown">
      <div
        class="login-btn"
        @click="toggleShowLoginModal"
        v-if="!isAuth && !isAuthRequested"
      >
        <UserIcon class="icon" />
      </div>
      <div class="profile" v-if="isAuth">
        <router-link
          :to="{ path: '/u/' + currentUserId }"
          class="avatar-link avatar-link_without-action"
        >
          <div class="avatar-img" :style="avatarStyleObject" />
        </router-link>
        <div
          class="avatar-link avatar-link_with-action"
          @click="toggleDrowdownVisible"
        >
          <div class="avatar-img" :style="avatarStyleObject" />
        </div>
        <div class="actions" @click="toggleDrowdownVisible">
          <div class="dropdown-toggle-btn"><ChevronDown class="icon" /></div>
        </div>
      </div>
      <transition name="dropdown">
        <Dropdown :closeCallback="closeDropdown" v-if="dropdownVisible" />
      </transition>
    </div>
    <div class="loader" />
  </header>
</template>

<style lang="scss">
.header {
  position: sticky;
  top: 0;
  width: 100%;
  height: 60px;
  display: flex;
  background: var(--header-bg);
  z-index: 4;

  &__item {
    position: relative;
    display: flex;
    flex-shrink: 0;

    .burger-btn {
      padding-left: 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .logo-btn {
      padding-left: 20px;
      display: flex;
      align-items: center;
      user-select: none;
    }

    .entry-create-btn {
      margin-right: 20px;
      display: flex;
      align-items: center;
      align-self: center;
      height: 40px;

      .icon {
        margin-left: 15px;
        width: 20px;
        height: 20px;
      }
    }

    .theme-toggle-btn,
    .bell-btn,
    .login-btn,
    .profile {
      display: flex;
    }

    .theme-toggle-btn,
    .bell-btn,
    .login-btn {
      padding: 0 17px;
      cursor: pointer;

      .icon {
        align-self: center;
      }
    }

    .theme-toggle-btn .icon,
    .bell-btn .icon,
    .profile .actions .dropdown-toggle-btn .icon,
    .burger-btn .icon,
    .login-btn .icon {
      color: var(--black-color);
    }

    .bell-btn,
    .login-btn {
      .icon {
        width: 28px;
        height: 28px;
      }
    }

    .bell-btn {
      position: relative;

      &_pressed {
        .icon {
          color: var(--brand-color);
          transform: rotate(10deg);
        }
      }

      .badge {
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

    .login-btn {
      padding-right: 30px;
    }

    .profile {
      .avatar-link {
        display: flex;
        cursor: pointer;

        .avatar-img {
          margin-left: 17px;
          width: 40px;
          height: 40px;
          align-self: center;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          background-size: cover;
          border-radius: 6px;
          box-shadow: inset 0 0 0 1px var(--box-shadow-avatar);
        }
      }

      .actions {
        display: flex;
        cursor: pointer;

        .dropdown-toggle-btn {
          padding-right: 30px;
          padding-left: 5px;
          display: flex;

          .icon {
            width: 20px;
            height: 20px;
            align-self: center;
          }
        }
      }
    }

    .dropdown {
      --right-gap: 20px;

      position: fixed;
      top: 65px;
      right: var(--right-gap);
      width: 200px;

      &-enter-active,
      &-leave-active {
        transition: all 100ms;
      }

      &-enter-from,
      &-leave-to {
        transform: translateY(-3px);
        opacity: 0;
      }
    }
  }
}

@media (hover: hover) {
  .header {
    &__item {
      &:hover {
        .burger-btn,
        .logo-btn {
          opacity: 0.7;
        }

        .theme-toggle-btn,
        .bell-btn,
        .login-btn {
          .icon {
            color: var(--brand-color);
          }
        }
      }

      .profile {
        .avatar-link {
          &:hover {
            .avatar-img {
              opacity: 0.8;
            }
          }
        }

        .actions {
          &:hover {
            .dropdown-toggle-btn {
              .icon {
                opacity: 0.7;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 500px) {
  .header {
    &__item {
      .entry-create-btn {
        display: none;
      }

      .theme-toggle-btn {
        display: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .header {
    &__item {
      .burger-btn {
        padding-left: 15px;
      }

      &.notifications {
        position: unset;
      }

      .bell-btn {
        padding: 0 10px;
      }

      .profile {
        .avatar-link {
          &_without-action {
            display: none;
          }

          .avatar-img {
            margin-right: 15px;
          }
        }

        .actions {
          display: none;
        }
      }

      .dropdown {
        --right-gap: 15px;

        .dropdown-component {
          .profile-link {
            display: flex;
          }
        }
      }
    }
  }
}

@media (min-width: 769px) {
  .header {
    &__item {
      .profile {
        .avatar-link {
          &.avatar-link_with-action {
            display: none;
          }
        }
      }
    }
  }
}
</style>