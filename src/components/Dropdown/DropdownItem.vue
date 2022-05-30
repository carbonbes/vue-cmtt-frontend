<script setup>
import { computed } from "vue";

const props = defineProps({
  data: Object,
});

const isLinkType = computed(() => props.data.type === "link");

const isDefaultType = computed(() => props.data.type === "default");
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
    active-class="dropdown-component__item_active"
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