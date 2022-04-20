<template>
  <div class="profile__entries" v-if="entriesList.length">
    <Entry
      v-for="(entry, index) in entriesList"
      :entry="entry"
      :key="entry.id"
    />
  </div>

  <div class="profile_entries-empty" v-if="!entriesList.length">
    <span>Здесь еще нет публикаций</span>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import rootStore from "@/store";
import nProgress from "nprogress";
import Entry from "@/components/Entry/Entry.vue";

export default {
  setup() {
    const store = useStore();

    const entriesList = computed(() => store.getters.profileEntries);

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
  & .entry {
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}
</style>