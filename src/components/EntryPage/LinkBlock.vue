<template>
  <div class="entry-page__link-block ep-island">
    <link-component
      :title="title"
      :description="description"
      :urlSrc="urlSrc"
      :sourceIcon="sourceIcon"
    />
  </div>
</template>

<script>
import LinkComponent from "@/components/LinkComponent.vue";

export default {
  components: { LinkComponent },

  props: {
    title: String,
    description: String,
    urlSrc: String,
    sourceIcon: String,
  },
};
</script>

<style lang="scss">
</style>