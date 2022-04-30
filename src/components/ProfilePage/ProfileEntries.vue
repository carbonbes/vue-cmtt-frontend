<template>
  <div class="profile__entries" v-if="entriesList.length">
    <template v-for="(entry, index) in entriesList" :key="entry.id">
      <Entry
        :entry="entry"
        v-if="entriesList.length !== index + 1"
      />

      <Entry
        :entry="entry"
        v-intersect="requestNextPage"
        v-else
      />
    </template>

    <div class="entries-loader" v-if="this.currentPage < this.totalPages">
      <loader />
    </div>
  </div>

  <div class="profile__entries_empty" v-if="!entriesList.length">
    <span>Пользователь не опубликовал ни одной записи</span>
  </div>
</template>

<script>
import { computed, ref, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import rootStore from "@/store";
import nProgress from "nprogress";
import Entry from "@/components/Entry/Entry.vue";
import Loader from "@/components/Loader.vue";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();

    // state
    const currentPage = ref(1);

    // computed
    const entriesList = computed(() => store.getters.profileEntries);

    const entriesListLastId = computed(
      () => store.getters.profileEntriesLastId
    );

    const entriesListLastSortingValue = computed(
      () => store.getters.profileEntriesLastSortingValue
    );

    const profileEntriesCount = computed(
      () => store.getters.profileEntriesCount
    );

    const totalPages = computed(() => {
      return Math.ceil(profileEntriesCount.value / 12);
    });

    // methods
    const requestNextPage = () => {
      if (currentPage.value < totalPages.value) {
        store.commit("setProfileEntriesIsRequested", true);

        store
          .dispatch("requestProfileEntries", {
            subsiteId: route.params.id,
            lastId: entriesListLastId.value,
            lastSortingValue: entriesListLastSortingValue.value,
          })
          .then(() => {
            currentPage.value += 1;
            store.commit("setProfileEntriesIsRequested", false);
          });
      }
    };

    onUnmounted(() => {
      store.commit("clearProfileEntries");
    });

    return {
      currentPage,
      entriesList,
      entriesListLastId,
      entriesListLastSortingValue,
      totalPages,
      requestNextPage,
    };
  },

  components: { Entry, Loader },

  beforeRouteEnter(routeTo, routeFrom, next) {
    nProgress.start();

    rootStore
      .dispatch("requestProfileEntries", {
        subsiteId: routeTo.params.id,
      })
      .then(() => {
        nProgress.done();
        next();
      });
  },
};
</script>

<style lang="scss">
.profile__entries {
  & .entries-loader {
    padding: 20px;
    max-width: 640px;
    background: var(--entry-bg-color);
    color: var(--black-color);
    border-radius: 8px;
    user-select: none;

    & .custom-loader {
      &__loader-1,
      &__loader-2,
      &__loader-3 {
        background-color: var(--black-color);
      }
    }
  }

  &_empty {
    padding: 88px 0;
    background: var(--entry-bg-color);
    border-radius: 8px;
    color: var(--grey-color);
    text-align: center;
  }

  & .entry {
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}

@media screen and (max-width: 641px) {
  .profile__entries_empty {
    border-radius: 0;
  }
}
</style>