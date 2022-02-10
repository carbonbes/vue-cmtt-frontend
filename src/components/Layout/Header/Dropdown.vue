<template>
  <div class="header-popup">
    <div class="header-popup__item exit-button" @click="this.logout">
      <logout-icon class="icon" />Выход
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import LogoutIcon from "@/assets/logos/logout_icon.svg?inline";

export default {
  components: { LogoutIcon },

  computed: {
    ...mapActions(["logout"]),
  },
};
</script>

<style lang="scss">
.header-popup {
  position: fixed;
  top: 60px;
  right: 20px;
  padding-top: 7px;
  padding-bottom: 7px;
  width: 175px;
  background: var(--dropdown-bg-color);
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 7%), 0 4px 8px 0 rgb(0 0 0 / 7%);
  user-select: none;

  &__item {
    display: flex;
    padding: 7px 15px;
    align-items: center;
    color: var(--black-color);
    cursor: pointer;

    &.exit-button {
      color: var(--red-color);
    }

    & .icon {
      margin-right: 10px;
      width: 16px;
      height: 16px;
    }
  }
}

@media (hover: hover) {
  .header-popup__item {
    &:hover {
      background: var(--dropdown-item-hover-bg-color);
    }
  }
}
</style>