<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import Dropdown from "@/components/Dropdown/Dropdown.vue";
import LogoutIcon from "@/assets/logos/logout_icon.svg?inline";

const store = useStore();

// computed
const dropdownConfig = computed(() => ({
  items: [
    {
      icon: LogoutIcon,
      iconStyle: "color: var(--red-color); stroke-width: 2.25;",
      label: "Выход",
      labelStyle: "color: var(--red-color)",
      action: logoutAction,
      type: "default",
    },
  ],
}));

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