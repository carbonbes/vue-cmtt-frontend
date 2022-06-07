<script setup>
import { computed, markRaw } from "vue";
import { useStore } from "vuex";
import Dropdown from "@/components/Dropdown/Dropdown.vue";
import UserIcon from "@/assets/logos/user_icon.svg?inline";
import SettingsIcon from "@/assets/logos/settings_icon.svg?inline";
import LogoutIcon from "@/assets/logos/logout_icon.svg?inline";

const store = useStore();

// props
const props = defineProps(["closeCallback"]);

// computed
const currentUserId = computed(() => store.getters.auth.id);

// methods
const logoutAction = () => {
  store.dispatch("logout");
};

const closeDropdownAction = () => {
  props.closeCallback();
};

const dropdownConfig = markRaw({
  items: [
    {
      icon: UserIcon,
      label: "Мой профиль",
      path: "/u/" + currentUserId.value,
      activeClassPathes: ["/u/" + currentUserId.value],
      action: closeDropdownAction,
      type: "link",
    },
    {
      icon: SettingsIcon,
      label: "Настройки",
      path: "/settings",
      activeClassPathes: ["/settings"],
      action: closeDropdownAction,
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
});
</script>

<template>
  <div class="dropdown">
    <Dropdown :data="dropdownConfig" />
  </div>
</template>