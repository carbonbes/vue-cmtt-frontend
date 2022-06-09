<script setup>
import { onMounted } from "vue";
import { useStore } from "vuex";
import MyFeedIcon from "@/assets/logos/my_feed_icon.svg?inline";
import MoonIcon from "@/assets/logos/moon_icon.svg?inline";

const store = useStore();

onMounted(() => {
  document.title = "Настройки";
  store.commit("closeStartScreen");
});
</script>

<template>
  <div class="settings-page__wrapp">
    <div class="settings-page">
      <div class="settings-page__content sp-island">
        <router-view></router-view>
      </div>
      <div class="settings-page__sidebar sp-island">
        <div class="sidebar-header">
          <div class="sidebar-header__title">Настройки</div>
        </div>
        <div class="sidebar-content">
          <router-link
            :to="{ path: '/settings/feed' }"
            class="sidebar-content__link"
            active-class="sidebar-content__link_active"
            ><MyFeedIcon class="icon" />
            <span class="label">Настройки ленты</span></router-link
          >
          <!-- <router-link
            :to="{ path: '/settings/appearance' }"
            class="sidebar-content__link"
            active-class="sidebar-content__link_active"
            ><MoonIcon stroke-width="2" class="icon" />
            <span class="label">Настройки темы</span></router-link
          > -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.settings-page {
  --grid-columns: 1fr 300px;
  --b-radius: 8px;
  --sidebar-display: block;

  padding-top: 20px;
  display: grid;
  grid-template-columns: var(--grid-columns);
  grid-gap: 20px;

  &__content {
    padding: 20px;
  }

  &__sidebar {
    display: var(--sidebar-display);
    overflow: hidden;

    & .sidebar-header {
      padding: 15px 20px;

      &__title {
        font-weight: 500;
      }
    }

    & .sidebar-content {
      &__link {
        padding: 13px 20px;
        display: flex;
        align-items: center;
        color: var(--grey-color);

        &_active {
          color: var(--black-color);
          background: \var(--dropdown-item-active-bg-color);
          pointer-events: none;
        }

        & .label {
          margin-left: 13px;
          font-weight: 500;
        }
      }
    }
  }

  &__wrapp {
    --wrapp-page-width: 960px;

    margin: 0 auto;
    max-width: var(--wrapp-page-width);
    color: var(--black-color);
  }

  & .sp-island {
    background: var(--entry-bg-color);
    border-radius: var(--b-radius);
  }
}

@media (max-width: 640px) {
  .settings-page {
    --b-radius: 0;
  }
}

@media (max-width: 999px) {
  .settings-page {
    --grid-columns: 1fr;
    --sidebar-display: none;

    &__wrapp {
      --wrapp-page-width: 640px;
    }
  }
}
</style>