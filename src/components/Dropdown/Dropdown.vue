<template>
  <div class="dropdown-component">
    <template v-for="(item, index) in props.data.items" :key="index">
      <DropdownItem :data="item" />
    </template>
  </div>
</template>

<script setup>
import DropdownItem from "./DropdownItem.vue";

// props
const props = defineProps({
  data: Object,
});
</script>

<style lang="scss">
.dropdown-component {
  padding: 6px;
  background: var(--dropdown-bg);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 6%), 0 0 1px rgb(0 0 0 / 25%);
  user-select: none;
  overflow-y: scroll;
  scrollbar-width: none;
  overscroll-behavior: none;

  &::-webkit-scrollbar {
    width: 0;
  }

  &__item {
    padding: 9px 12px;
    display: flex;
    align-items: center;
    border-radius: 6px;
    color: var(--black-color);
    white-space: nowrap;
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 4px;
    }

    .icon {
      margin-right: 10px;
      width: 20px;
      height: 20px;
    }

    &_active {
      background: var(--dropdown-item-active-bg);
      font-weight: 500;
      pointer-events: none;
      cursor: default;
    }
  }
}

@media (hover: hover) {
  .dropdown-component {
    &__item {
      &:hover {
        background: var(--dropdown-item-hover-bg);
      }
    }
  }
}
</style>