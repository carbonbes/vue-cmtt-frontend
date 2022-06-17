<script setup>
import SuccessIcon from "@/assets/logos/success_icon.svg?inline";
import ErrorIcon from "@/assets/logos/error_icon.svg?inline";
</script>

<template>
  <notifications>
    <template #body="props">
      <div class="notification" :class="props.item.type" @click="props.close">
        <div class="notification__icon">
          <SuccessIcon class="success-icon" />
          <ErrorIcon class="error-icon" />
        </div>
        <div class="notification__content">
          <span class="content-title" v-text="props.item.title"> </span>
          <div class="content-main" v-html="props.item.text" />
        </div>
      </div>
    </template>
  </notifications>
</template>

<style lang="scss">
.vue-notification {
  &-wrapper {
    overflow: unset;
  }

  &-group {
    top: 72px !important;
    right: 10px !important;
    cursor: pointer;
  }
}

.notification {
  margin: 0 5px 10px;
  padding: 12px;
  display: flex;
  color: var(--black-color);
  background: var(--modal-bg-light);
  border-radius: 6px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 6%), 0 0 1px rgb(0 0 0 / 25%);

  &__icon {
    display: flex;
  }

  &__content {
    margin-left: 12px;
    display: flex;
    flex-flow: column;
    font-size: 15px;

    .content-title {
      font-size: 14px;
      font-weight: 500;

      + .content-main {
        margin-top: 5px;
      }
    }
  }

  &.success {
    .notification__icon {
      .error-icon {
        display: none;
      }
    }
  }

  &.error {
    .notification__icon {
      .success-icon {
        display: none;
      }
    }
  }
}

.vn-fade-enter-from,
.vn-fade-enter-to {
  animation: notify 0.35s;
}

@keyframes notify {
  0% {
    transform: translateX(100%);
  }

  75% {
    transform: translateX(-15px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>