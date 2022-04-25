<template>
  <router-link
    :to="props.path"
    @click="props.action ? props.action(actionInfo) : null"
    class="dropdown__item"
    active-class="dropdown__item_active"
  >
    <component class="icon" :is="props.icon" v-if="props.icon"></component>
    <div class="label" v-text="props.label" v-if="props.label"></div>
  </router-link>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  icon: Object,
  label: String,
  action: Function,
  actionInfo: Object,
  path: String,
});
</script>