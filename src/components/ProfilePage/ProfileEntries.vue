<template>
  <div class="profile__entries">
    <Entry
      v-for="(entry, index) in entriesList"
      :entry="entry"
      :key="entry.id"
    />
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import Entry from "@/components/Entry/Entry.vue";

const store = useStore();

const entriesList = computed(() => store.getters.profileEntries);
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