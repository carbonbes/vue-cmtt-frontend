<script setup>
import { reactive, computed } from "vue";
import Dropdown from "@/components/Dropdown/Dropdown.vue";
import ChevronDown from "@/assets/logos/chevron-down_icon.svg?inline";

// props
const props = defineProps(["settings", "disabled"]);

// state
const state = reactive({
  isPressed: false,
  dropdownVisible: false,
});

// computed
const componentClassObj = computed(() => ({
  "selector_pressed с-form_pressed": state.isPressed,
  selector_disabled: props.disabled,
}));

const selectedItemLabel = computed(() => {
  if (props.settings) {
    const items = props.settings.items.filter((item) => item.isSelected);

    if (items.length) {
      return items[0].label;
    } else return "Выберите значение";
  }
});

// methods
const selectorClickHandler = () => {
  state.isPressed = !state.isPressed;
  state.dropdownVisible = !state.dropdownVisible;
};

const selectorCloseHandler = () => {
  state.isPressed = false;
  state.dropdownVisible = false;
};
</script>

<template>
  <div class="select-component" v-outside-click:[true]="selectorCloseHandler">
    <div
      class="selector с-form"
      :class="componentClassObj"
      @click="selectorClickHandler"
    >
      <span class="label" v-text="selectedItemLabel"></span>
      <ChevronDown class="icon" />
    </div>

    <transition name="dropdown">
      <div class="dropdown" v-if="state.dropdownVisible">
        <Dropdown :data="props.settings" @click="selectorCloseHandler" />
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.select-component {
  position: relative;

  & .selector {
    padding-left: 15px;
    padding-right: 12px;
    display: flex;
    align-items: center;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;

    &_pressed {
      & .icon {
        transform: rotate(180deg);
      }
    }

    &_disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    & .icon {
      margin-left: auto;
      width: 20px;
      height: 20px;
      transition: transform 0.2s;
    }
  }

  & .dropdown {
    position: absolute;
    margin-top: 7px;
    width: 100%;
    z-index: 1;

    &-enter-active,
    &-leave-active {
      transition: all 100ms;
    }

    &-enter-from,
    &-leave-to {
      transform: translateY(-5px);
      opacity: 0;
    }
  }
}
</style>