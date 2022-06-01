<script setup>
import { computed, markRaw } from "vue";
import { useStore } from "vuex";
import Dropdown from "@/components/Dropdown/Dropdown.vue";
import UserIcon from "@/assets/logos/user_icon.svg?inline";
import LogoutIcon from "@/assets/logos/logout_icon.svg?inline";

const store = useStore();

// computed
const currentUserId = computed(() => store.getters.auth.id);

// methods
const logoutAction = () => {
  store.dispatch("logout");
};

const dropdownConfig = markRaw({
  items: [
    {
      itemClass: "profile-link",
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
});
</script>

<template>
  <div class="dropdown">
    <Dropdown :data="dropdownConfig" />
  </div>
</template>