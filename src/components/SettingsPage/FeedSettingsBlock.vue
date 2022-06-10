<script setup>
import { markRaw, reactive, computed, onMounted, watch } from "vue";
import Select from "@/components/Select/Select.vue";
import { notify } from "@kyvg/vue3-notification";

// state
const state = reactive({
  selectedPageName: null,
  selectedPageNameSorting: null,
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
  state.settingsChange = true;
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
  state.settingsChange = true;
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
      <div class="item-content">
        <Select :settings="selectorPageNameDropdownConfig" />
      </div>
    </div>

    <div class="feed-settings-block__item">
      <span class="item-title">Сортировка ленты по умолчанию</span>
      <div class="item-content">
        <Select :settings="selectorPageNameSortingDropdownConfig" />
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
      & .select-component {
        margin-top: 12px;
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