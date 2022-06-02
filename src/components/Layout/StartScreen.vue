<template>
  <div class="start-screen" v-scroll-lock:[true]="props.isShow">
    <SiteLogo class="logo" />
  </div>
</template>

<script setup>
import SiteLogo from "@/assets/logos/site_logo.svg?inline";

// props
const props = defineProps(["isShow"]);
</script>