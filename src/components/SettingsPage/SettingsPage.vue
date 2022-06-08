<script setup>
import MyFeedIcon from "@/assets/logos/my_feed_icon.svg?inline";
</script>

<template>
  <div class="settings-page__wrapp">
    <div class="settings-page">
      <div class="settings-page__content sp-island">
        <router-view></router-view>
      </div>
      <div class="settings-page__sidebar sp-island">
        <div class="sidebar-content">
          <div class="sidebar-content__link">
            <router-link
              :to="{ path: '/settings/feed' }"
              class="link"
              active-class="link_active"
              ><MyFeedIcon class="icon" />
              <span class="label">Настройки ленты</span></router-link
            >
          </div>
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

    & .sidebar-content {
      & .sidebar-content__link {
        & > .link {
          padding: 15px 20px;
          display: flex;
          align-items: center;
          font-weight: 500;

          &_active {
            background: var(--dropdown-item-active-bg-color);
            pointer-events: none;
          }

          & .icon {
            width: 22px;
            height: 22px;
            color: var(--grey-color);
          }

          & .label {
            margin-left: 10px;
          }
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