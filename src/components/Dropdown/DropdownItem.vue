<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// props
const props = defineProps({
  data: Object,
});

// computed
const isLinkType = computed(() => props.data.type === "link");
const isDefaultType = computed(() => props.data.type === "default");

const itemClassObj = computed(() => {
  if (props.data.activeClassPathes) {
    return {
      "dropdown-component__item_active": props.data.activeClassPathes.some(
        (some) => some === route.path
      ),
    };
  } else if (props.data.isSelected) {
    return {
      "dropdown-component__item_active": props.data.isSelected,
    };
  }
});
</script>

<template>
  <router-link
    :to="props.data.path"
    @click="
      props.data.action
        ? props.data.action(
            props.data.actionInfo ? props.data.actionInfo : null
          )
        : null
    "
    class="dropdown-component__item"
    :class="itemClassObj"
    v-if="isLinkType"
  >
    <component
      class="icon"
      :style="props.data.iconStyle"
      :is="props.data.icon"
      v-if="props.data.icon"
    ></component>
    <div
      class="label"
      :style="props.data.labelStyle"
      v-text="props.data.label"
      v-if="props.data.label"
    ></div>
  </router-link>

  <div
    @click="
      props.data.action
        ? props.data.action(
            props.data.actionInfo ? props.data.actionInfo : null
          )
        : null
    "
    class="dropdown-component__item"
    :class="itemClassObj"
    v-if="isDefaultType"
  >
    <component
      class="icon"
      :style="props.data.iconStyle"
      :is="props.data.icon"
      v-if="props.data.icon"
    ></component>
    <div
      class="label"
      :style="props.data.labelStyle"
      v-text="props.data.label"
      v-if="props.data.label"
    ></div>
  </div>
</template>