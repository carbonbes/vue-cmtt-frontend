<script setup>
const props = defineProps(["color"]);
</script>

<template>
  <div class="loader-component">
    <span
      v-for="index in 3"
      :key="index"
      :class="'loader-component__' + index"
      :style="{ backgroundColor: props.color }"
    />
  </div>
</template>

<style lang="scss">
.loader-component {
  margin: 0 auto;
  width: 20px;
  height: 4px;
  display: flex;
  align-items: center;

  &__1,
  &__2,
  &__3 {
    width: 4px;
    height: 4px;
    display: block;
    border-radius: 50%;
    opacity: 0.2;
    animation: loader 1s infinite;

    &:nth-child(1) {
      margin-right: 4px;
    }

    &:nth-child(2) {
      margin-right: 4px;
      animation-delay: 0.1s;
    }

    &:nth-child(3) {
      animation-delay: 0.2s;
    }
  }
}

@keyframes loader {
  0%,
  48% {
    opacity: 0.2;
  }
  24% {
    opacity: 0.8;
  }
}
</style>