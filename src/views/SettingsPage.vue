<script>
import store from "../store";
import SettingsPage from "@/components/SettingsPage/SettingsPage.vue";

export default {
  components: { SettingsPage },

  beforeRouteEnter() {
    document.title = "Настройки";
    store.commit("closeStartScreen");
  },
};
</script>

<template>
  <SettingsPage />
</template>