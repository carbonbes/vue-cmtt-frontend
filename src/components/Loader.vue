<template>
  <div class="custom-loader">
    <span class="custom-loader__loader-1"></span>
    <span class="custom-loader__loader-2"></span>
    <span class="custom-loader__loader-3"></span>
  </div>
</template>

<style lang="scss">
.custom-loader {
  margin: 0 auto;
  width: 20px;
  height: 4px;
  display: flex;
  align-items: center;

  &__loader-1,
  &__loader-2,
  &__loader-3 {
    width: 4px;
    height: 4px;
    display: block;
    background-color: var(--black-color);
    border-radius: 50%;
    opacity: 0.2;
    animation-name: loader;
    animation-duration: 1s;
    animation-iteration-count: infinite;

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