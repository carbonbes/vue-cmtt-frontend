<template>
  <div class="profile__entries" v-if="entriesList.length">
    <template v-for="(entry, index) in entriesList" :key="entry.id">
      <ArticleComponent
        :article="entry"
        type="profileArticle"
        v-if="entriesList.length !== index + 1"
      />

      <ArticleComponent
        :article="entry"
        type="profileArticle"
        v-intersect="{
          type: 'when-appears',
          threshold: 0,
          callback: requestNextPage,
        }"
        v-else
      />
    </template>

    <div class="entries-loader" v-if="this.currentPage < this.totalPages">
      <Loader color="var(--black-color)" />
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
import ArticleComponent from "../Article/ArticleComponent.vue";
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
            params: {
              subsitesIds: route.params.id,
              lastId: entriesListLastId.value,
              lastSortingValue: entriesListLastSortingValue.value,
            },
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

  components: { ArticleComponent, Loader },
};
</script>

<style lang="scss">
.profile__entries {
  .entries-loader {
    padding: 20px;
    max-width: 640px;
    background: var(--island-bg);
    color: var(--black-color);
    border-radius: 8px;
    user-select: none;
  }

  &_empty {
    padding: 88px 0;
    background: var(--island-bg);
    border-radius: 8px;
    color: var(--grey-color);
    text-align: center;
  }

  .article-component {
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