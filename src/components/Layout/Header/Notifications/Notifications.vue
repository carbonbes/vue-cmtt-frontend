<template>
  <div class="header__notifications">
    <div class="notifications-header us-none">
      <div class="label">Уведомления</div>
    </div>
    <div class="delimiter"></div>
    <ScrollComponent
      class="notifications-content"
      content-max-height="450px"
      thumb-track-y-offset="5px"
      thumb-width="4px"
      thumb-right-offset="5px"
      v-if="notifications.length > 0 && isAuth && !state.isRequested"
    >
      <div
        class="new-notifications-btn"
        @click="requestNewNotifications"
        v-if="state.isOpen && unreadNotifications > 0"
      >
        Новые уведомления
      </div>
      <template v-for="(item, index) in notifications" :key="item.id">
        <NotificationsItem
          :item="item"
          v-if="notifications.length !== index + 1"
          @click="closeNotifications"
        />

        <NotificationsItem
          :item="item"
          v-else
          v-intersect="{
            type: 'when-appears',
            threshold: 0,
            callback: requestNextPage,
          }"
          @click="closeNotifications"
        />
      </template>
      <div class="notifications-content__loader">
        <Loader color="var(--black-color)" />
      </div>
    </ScrollComponent>
    <div
      class="notifications-content__empty"
      v-if="!notifications.length && isAuth && !state.isRequested"
    >
      Здесь ещё нет уведомлений
    </div>
    <div class="notifications-content__empty" v-if="!isAuth">
      Войдите в аккаунт, чтобы просмотреть свои уведомления
    </div>
    <div class="notifications-content__loading" v-if="state.isRequested">
      <Loader color="var(--black-color)" />
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import NotificationsItem from "./NotificationsItem.vue";
import Loader from "@/components/Loader.vue";
import ScrollComponent from "@/components/ScrollComponent.vue";

const store = useStore();

// props
const props = defineProps({
  close: Function,
});

// state
const state = reactive({
  isOpen: false,
  isRequested: false,
  isNextPageRequested: false,
});

// computed
const isAuth = computed(() => store.getters.isAuth);

const notifications = computed(() => store.getters.notifications);

const notificationsLastId = computed(() => store.getters.notificationsLastId);

const unreadNotifications = computed(() => store.getters.unreadNotifications);

// methods
const requestNotifications = () => {
  setIsRequested(true);

  store.dispatch("requestNotifications", {}).then(() => {
    setIsRequested(false);
  });
};

const requestNextPage = () => {
  setIsNextPageRequested(true);

  store
    .dispatch("requestNotifications", { lastId: notificationsLastId.value })
    .then(() => {
      setIsNextPageRequested(false);
    });
};

const requestNewNotifications = () => {
  clearNotifications();
  requestNotifications();
};

const clearNotifications = () => {
  store.commit("clearNotifications");
};

const setIsRequested = (value) => {
  state.isRequested = value;
};

const setIsNextPageRequested = (value) => {
  state.isNextPageRequested = value;
};

const closeNotifications = () => {
  props.close();
};

// mounted
onMounted(() => {
  state.isOpen = true;

  if (
    isAuth.value &&
    (notifications.value.length === 0 || unreadNotifications.value > 0)
  ) {
    clearNotifications();
    requestNotifications();
  }
});

onUnmounted(() => {
  state.isOpen = false;
});
</script>

<style lang="scss">
.header__notifications {
  --mt: 5px;
  --width: 430px;
  --bradius: 8px;
  --avatar-size: 40px;

  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--mt);
  width: var(--width);
  color: var(--black-color);
  background: var(--dropdown-bg);
  box-shadow: 0 4px 8px rgb(0 0 0 / 6%), 0 0 1px rgb(0 0 0 / 25%);
  border-radius: var(--bradius);

  .notifications-header {
    padding: 15px 20px;

    .label {
      font-weight: 500;
    }
  }

  .delimiter {
    margin: 0 20px;
    border-bottom: 1px solid var(--branch-color);
  }

  .notifications-content {
    max-height: 450px;

    .new-notifications-btn {
      position: sticky;
      top: 0;
      padding: 15px;
      font-size: 15px;
      font-weight: 500;
      color: var(--blue-color);
      background: var(--header-notifications-new-notifications-btn-bg);
      text-align: center;
      cursor: pointer;
      z-index: 2;
    }

    .ps {
      &__rail-y {
        width: 0;
        z-index: 3;

        .pc--clicking {
          background-color: unset;
        }
      }

      &__thumb-y {
        background-color: var(--dropdown-scrollbar-thumb-bg);
      }
    }

    &__empty {
      padding: 20px;
      color: var(--grey-color);
      text-align: center;
    }

    &__loading {
      height: 250px;
      display: flex;
      align-items: center;
    }

    &__loader {
      padding: 20px;
    }

    &__item {
      position: relative;
      padding: 12px 20px;
      display: flex;
      flex-flow: row;
      font-size: 14px;
      line-height: 21px;

      &:first-child {
        padding: 15px 20px;
      }

      .item__avatar {
        position: relative;
        margin-right: 12px;
        width: var(--avatar-size);
        height: var(--avatar-size);

        .avatar {
          min-width: var(--avatar-size);
          min-height: var(--avatar-size);
          width: var(--avatar-size);
          height: var(--avatar-size);
          background-size: cover;
          border-radius: 50%;
          box-shadow: inset 0 0 0 1px var(--box-shadow-avatar);
        }

        .icon {
          position: absolute;
          top: 65%;
          right: -2px;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          border-radius: 50%;

          &_other {
            background: #66a6ed;

            svg {
              width: 8px;
              height: 8px;
            }
          }

          &_subscribe {
            background: #66a6ed;

            svg {
              width: 11px;
              height: 12px;
            }
          }

          &_like {
            background: #45c045;

            svg {
              width: 16px;
              height: 11px;
            }
          }

          &_dislike {
            background: #ff4759;

            svg {
              width: 16px;
              height: 11px;
              transform: rotate(180deg);
            }
          }
        }
      }

      .item__content {
        a {
          position: relative;
          z-index: 1;
          &:hover {
            color: var(--blue-color);
          }

          b {
            font-weight: 500;
          }
        }

        .date-time {
          display: inline-block;
          color: var(--grey-color);
          font-size: 13px;
        }
      }

      .item__url {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }

  &-enter-active,
  &-leave-active {
    transition: all 100ms;
  }

  &-enter-from,
  &-leave-to {
    transform: translateY(-3px);
    opacity: 0;
  }
}

@media (hover: hover) {
  .header__notifications {
    .notifications-content {
      &__item {
        &:hover {
          background: var(--dropdown-item-hover-bg);
        }
      }

      .ps {
        &__rail-y {
          &:hover {
            width: unset;
            background-color: unset;

            > .ps__thumb-y {
              width: 6px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .header__notifications {
    --mt: 0;
    --width: 100%;
    --bradius: 0;
  }
}
</style>