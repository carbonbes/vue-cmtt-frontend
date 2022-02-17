<template>
  <div class="custom-loader">
    <span class="loader-1"></span>
    <span class="loader-2"></span>
    <span class="loader-3"></span>
  </div>
</template>

<style lang="scss">
.custom-loader {
  width: 20px;
  height: 4px;
  display: flex;
  align-items: center;
}

.loader-1,
.loader-2,
.loader-3 {
  width: 4px;
  height: 4px;
  display: block;
  background-color: #000;
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