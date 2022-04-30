<template>
  <div class="profile__entries" v-if="entriesList.length">
    <Entry v-for="entry in entriesList" :entry="entry" :key="entry.id" />
  </div>

  <div class="profile__entries_empty" v-if="!entriesList.length">
    <span>Пользователь не опубликовал ни одной записи</span>
  </div>
</template>

<script>
import { computed, onUnmounted } from "vue";
import { useStore } from "vuex";
import rootStore from "@/store";
import nProgress from "nprogress";
import Entry from "@/components/Entry/Entry.vue";

export default {
  setup() {
    const store = useStore();

    // computed
    const entriesList = computed(() => store.getters.profileEntries);

    const entriesListLastId = computed(
      () => store.getters.profileEntriesLastId
    );

    onUnmounted(() => {
      store.commit("clearProfileEntries");
    });

    return { entriesList };
  },

  components: { Entry },

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