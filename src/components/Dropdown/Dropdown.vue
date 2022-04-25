<template>
  <div class="dropdown">
    <DropdownItem
      v-for="(item, index) in props.data.items"
      :key="index"
      :path="item.path"
      :icon="item.icon"
      :label="item.label"
      :action="item.action"
      :actionInfo="item.actionInfo"
    />
  </div>
</template>

<script setup>
import DropdownItem from "./DropdownItem.vue";

const props = defineProps({
  data: Object,
});
</script>

<style lang="scss">
.dropdown {
  padding: 6px;
  background: var(--dropdown-bg-color);
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

    &:not(:last-child) {
      margin-bottom: 4px;
    }

    &_active {
      background: var(--dropdown-item-active-bg-color);
      font-weight: 500;
      pointer-events: none;
      cursor: default;
    }
  }
}

@media (hover: hover) {
  .dropdown {
    &__item {
      &:hover {
        background: var(--dropdown-item-hover-bg-color);
      }
    }
  }
}
</style>