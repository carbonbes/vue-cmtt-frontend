<script>
import store from "../store";
import SettingsPage from "@/components/SettingsPage/SettingsPage.vue";

export default {
  components: { SettingsPage },

  beforeRouteEnter() {
    store.commit("closeStartScreen");
  },
};
</script>

<template>
  <SettingsPage />
</template>