<script setup>
import { markRaw, reactive, computed, onMounted, watch } from "vue";
import Dropdown from "../Dropdown/Dropdown.vue";
import ChevronDown from "@/assets/logos/chevron-down_icon.svg?inline";
import { notify } from "@kyvg/vue3-notification";

// state
const state = reactive({
  selectedPageName: null,
  selectedPageNameSorting: null,
  pageNameSelectorVisible: false,
  pageNameSortingSelectorVisible: false,
  pageNameSelectorPressed: false,
  pageNameSortingSelectorPressed: false,
  settingsChange: false,
});

// computed
const selectorPageNameLabel = computed(() => {
  if (!state.selectedPageName || state.selectedPageName === "popular") {
    return "Популярное";
  } else if (state.selectedPageName === "new") {
    return "Свежее";
  } else if (state.selectedPageName === "my") {
    return "Моя лента";
  }
});

const selectorFeedSortingLabel = computed(() => {
  if (state.selectedPageName === "popular") {
    if (state.selectedPageNameSorting === "hotness") {
      return "Популярное";
    } else if (state.selectedPageNameSorting === "new") {
      return "Свежее";
    }
  } else if (state.selectedPageName === "new") {
    if (state.selectedPageNameSorting === "from-10") {
      return "От -10";
    } else if (state.selectedPageNameSorting === "from5") {
      return "От +5";
    } else if (state.selectedPageNameSorting === "from10") {
      return "От +10";
    } else if (state.selectedPageNameSorting === "all") {
      return "Все";
    }
  } else if (state.selectedPageName === "my") {
    if (state.selectedPageNameSorting === "hotness") {
      return "Популярное";
    } else if (state.selectedPageNameSorting === "new") {
      return "Свежее";
    }
  }
});

const selectorPageNameDropdownConfig = computed(() => ({
  items: [
    {
      label: "Популярное",
      action: setCurrentPageName,
      actionInfo: "popular",
      type: "default",
      isSelected: state.selectedPageName === "popular",
    },
    {
      label: "Свежее",
      action: setCurrentPageName,
      actionInfo: "new",
      type: "default",
      isSelected: state.selectedPageName === "new",
    },
    {
      label: "Моя лента",
      action: setCurrentPageName,
      actionInfo: "my",
      type: "default",
      isSelected: state.selectedPageName === "my",
    },
  ],
}));

const selectorPageNameSortingDropdownConfig = computed(() => {
  if (state.selectedPageName === "popular") {
    return {
      items: [
        {
          label: "Популярное",
          type: "default",
          action: setCurrentPageNameSorting,
          actionInfo: "hotness",
          isSelected: state.selectedPageNameSorting === "hotness",
        },
        {
          label: "Свежее",
          type: "default",
          action: setCurrentPageNameSorting,
          actionInfo: "new",
          isSelected: state.selectedPageNameSorting === "new",
        },
      ],
    };
  } else if (state.selectedPageName === "new") {
    return {
      items: [
        {
          label: "От -10",
          type: "default",
          action: setCurrentPageNameSorting,
          actionInfo: "from-10",
          isSelected:
            state.selectedPageName === "new" &&
            state.selectedPageNameSorting === "from-10",
        },
        {
          label: "От +5",
          type: "default",
          action: setCurrentPageNameSorting,
          actionInfo: "from5",
          isSelected:
            state.selectedPageName === "new" &&
            state.selectedPageNameSorting === "from5",
        },
        {
          label: "От +10",
          type: "default",
          action: setCurrentPageNameSorting,
          actionInfo: "from10",
          isSelected:
            state.selectedPageName === "new" &&
            state.selectedPageNameSorting === "from10",
        },
        {
          label: "Все",
          type: "default",
          action: setCurrentPageNameSorting,
          actionInfo: "all",
          isSelected:
            state.selectedPageName === "new" &&
            state.selectedPageNameSorting === "all",
        },
      ],
    };
  } else if (state.selectedPageName === "my") {
    return {
      items: [
        {
          label: "Популярное",
          type: "default",
          action: setCurrentPageNameSorting,
          actionInfo: "hotness",
          isSelected:
            state.selectedPageName === "my" &&
            state.selectedPageNameSorting === "hotness",
        },
        {
          label: "Свежее",
          type: "default",
          action: setCurrentPageNameSorting,
          actionInfo: "new",
          isSelected:
            state.selectedPageName === "my" &&
            state.selectedPageNameSorting === "new",
        },
      ],
    };
  }
});

const pageNameSelectorClassObj = computed(() => ({
  "selector_pressed v-form_pressed": state.pageNameSelectorPressed,
}));

const pageNameSortingSelectorClassObj = computed(() => ({
  "selector_pressed v-form_pressed": state.pageNameSortingSelectorPressed,
}));

// methods
const getCurrentPageName = () => {
  const pageName = localStorage.getItem("pageName");

  if (!pageName) {
    state.selectedPageName = "popular";
  } else {
    state.selectedPageName = pageName;
  }
};
const setCurrentPageName = (pageName) => {
  state.selectedPageName = pageName;
  state.pageNameSelectorVisible = false;
  state.settingsChange = true;
  state.pageNameSelectorPressed = false;
};

const getCurrentPageNameSorting = () => {
  const popularFeedSorting = localStorage.getItem("popularFeedSorting");
  const newFeedSorting = localStorage.getItem("newFeedSorting");
  const myFeedSorting = localStorage.getItem("myFeedSorting");

  if (!popularFeedSorting || !myFeedSorting) {
    state.selectedPageNameSorting = "popular";
  } else if (!newFeedSorting) {
    state.selectedPageNameSorting = "from-10";
  } else if (state.selectedPageName === "popular" && popularFeedSorting) {
    state.selectedPageNameSorting = popularFeedSorting;
  } else if (state.selectedPageName === "new" && newFeedSorting) {
    state.selectedPageNameSorting = newFeedSorting;
  } else if (state.selectedPageName === "my" && myFeedSorting) {
    state.selectedPageNameSorting = myFeedSorting;
  }
};
const setCurrentPageNameSorting = (pageNameSorting) => {
  state.selectedPageNameSorting = pageNameSorting;
  state.pageNameSortingSelectorVisible = false;
  state.settingsChange = true;
  state.pageNameSortingSelectorPressed = false;
};

const saveFeedSettings = () => {
  localStorage.setItem("pageName", state.selectedPageName);

  if (state.selectedPageName === "popular") {
    localStorage.setItem("popularFeedSorting", state.selectedPageNameSorting);
  } else if (state.selectedPageName === "new") {
    localStorage.setItem("newFeedSorting", state.selectedPageNameSorting);
  } else if (state.selectedPageName === "my") {
    localStorage.setItem("myFeedSorting", state.selectedPageNameSorting);
  }

  notify({
    title: "Изменения сохранены",
    type: "succ",
    text: "Настройки ленты сохранены!",
  });

  state.settingsChange = false;
};

const togglePageNameSelector = () => {
  state.pageNameSelectorVisible = !state.pageNameSelectorVisible;
  state.pageNameSelectorPressed = !state.pageNameSelectorPressed;
};
const closePageNameSelector = () => {
  state.pageNameSelectorVisible = false;
  state.pageNameSelectorPressed = false;
};

const togglePageNameSortingSelector = () => {
  state.pageNameSortingSelectorVisible = !state.pageNameSortingSelectorVisible;
  state.pageNameSortingSelectorPressed = !state.pageNameSortingSelectorPressed;
};
const closePageNameSortingSelector = () => {
  state.pageNameSortingSelectorVisible = false;
  state.pageNameSortingSelectorPressed = false;
};

watch(
  () => state.selectedPageName,
  () => {
    const popularFeedSorting = localStorage.getItem("popularFeedSorting");
    const newFeedSorting = localStorage.getItem("newFeedSorting");
    const myFeedSorting = localStorage.getItem("myFeedSorting");

    if (!popularFeedSorting || !myFeedSorting) {
      state.selectedPageNameSorting = "popular";
    } else if (!newFeedSorting) {
      state.selectedPageNameSorting = "from-10";
    } else if (state.selectedPageName === "popular" && popularFeedSorting) {
      state.selectedPageNameSorting = popularFeedSorting;
    } else if (state.selectedPageName === "new" && newFeedSorting) {
      state.selectedPageNameSorting = newFeedSorting;
    } else if (state.selectedPageName === "my" && myFeedSorting) {
      state.selectedPageNameSorting = myFeedSorting;
    }
  }
);

onMounted(() => {
  getCurrentPageName();
  getCurrentPageNameSorting();
});
</script>

<template>
  <div class="feed-settings-block">
    <div class="feed-settings-block__item">
      <span class="item-title">Лента по умолчанию</span>
      <div class="item-content" v-outside-click:[true]="closePageNameSelector">
        <div
          class="selector v-form"
          :class="pageNameSelectorClassObj"
          @click="togglePageNameSelector"
        >
          <span class="label" v-text="selectorPageNameLabel"></span>
          <ChevronDown class="icon" />
        </div>
        <div class="dropdown">
          <transition name="dropdown">
            <Dropdown
              :data="selectorPageNameDropdownConfig"
              v-if="state.pageNameSelectorVisible"
            />
          </transition>
        </div>
      </div>
    </div>

    <div class="feed-settings-block__item">
      <span class="item-title">Сортировка ленты по умолчанию</span>
      <div
        class="item-content"
        v-outside-click:[true]="closePageNameSortingSelector"
      >
        <div
          class="selector v-form"
          :class="pageNameSortingSelectorClassObj"
          @click="togglePageNameSortingSelector"
        >
          <span class="label" v-text="selectorFeedSortingLabel"></span>
          <ChevronDown class="icon" />
        </div>
        <div class="dropdown">
          <transition name="dropdown">
            <Dropdown
              :data="selectorPageNameSortingDropdownConfig"
              v-if="state.pageNameSortingSelectorVisible"
            />
          </transition>
        </div>
      </div>
    </div>

    <div class="feed-settings-block__item">
      <div class="action-button">
        <button
          class="button button_b"
          @click="saveFeedSettings"
          :disabled="!state.settingsChange"
        >
          <div class="label">Сохранить</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.feed-settings-block {
  &__item {
    &:not(:first-child) {
      margin-top: 25px;
    }

    & .item-title {
      font-size: 18px;
      font-weight: 500;
    }

    & .item-content {
      position: relative;

      & .selector {
        margin-top: 12px;
        padding-left: 15px;
        padding-right: 12px;
        height: 40px;
        display: flex;
        align-items: center;
        border-radius: 8px;
        cursor: pointer;
        user-select: none;

        &_pressed {
          & .icon {
            transform: rotate(180deg);
          }
        }

        & .icon {
          margin-left: auto;
          width: 20px;
          height: 20px;
          transition: transform 0.2s;
        }
      }

      & .dropdown {
        position: absolute;
        width: 100%;
        z-index: 1;

        &-enter-active,
        &-leave-active {
          transition: all 100ms;
        }

        &-enter-from,
        &-leave-to {
          transform: translateY(-3px);
          opacity: 0;
        }

        & > .dropdown-component {
          margin-top: 7px;
        }
      }
    }

    & .action-button {
      display: inline-block;

      & > .button {
        padding: 10px 15px;
      }
    }
  }
}
</style>