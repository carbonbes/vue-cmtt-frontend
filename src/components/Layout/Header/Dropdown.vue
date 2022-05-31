<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useMediaQuery } from "@vueuse/core";
import Dropdown from "@/components/Dropdown/Dropdown.vue";
import UserIcon from "@/assets/logos/user_icon.svg?inline";
import LogoutIcon from "@/assets/logos/logout_icon.svg?inline";

const store = useStore();

const isMobile = useMediaQuery("(max-width: 768px)");

// computed
const currentUserId = computed(() => store.getters.auth.id);

const dropdownConfig = computed(() => {
  if (isMobile.value) {
    return {
      items: [
        {
          icon: UserIcon,
          label: "Профиль",
          path: "/u/" + currentUserId.value,
          type: "link",
        },
        {
          icon: LogoutIcon,
          iconStyle: "color: var(--red-color);",
          label: "Выйти",
          labelStyle: "color: var(--red-color);",
          action: logoutAction,
          type: "default",
        },
      ],
    };
  } else {
    return {
      items: [
        {
          icon: LogoutIcon,
          iconStyle: "color: var(--red-color);",
          label: "Выйти",
          labelStyle: "color: var(--red-color);",
          action: logoutAction,
          type: "default",
        },
      ],
    };
  }
});

// methods
const logoutAction = () => {
  store.dispatch("logout");
};
</script>

<template>
  <div class="header-popup">
    <Dropdown :data="dropdownConfig" />
  </div>
</template>

<style lang="scss">
.header-popup {
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

@media screen and (max-width: 768px) {
  .header-popup {
    --right-gap: 15px;
  }
}
</style>