<template>
  <div class="entry-page__person-block ep-island">
    <person-component
      :avatarSrc="avatar"
      :name="name"
      :description="description"
    />
  </div>
</template>

<script>
import PersonComponent from "@/components/PersonComponent.vue";

export default {
  components: { PersonComponent },

  props: {
    avatar: String,
    name: String,
    description: String,
  },
};
</script>

<style lang="scss">
.entry-page__person-block {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>