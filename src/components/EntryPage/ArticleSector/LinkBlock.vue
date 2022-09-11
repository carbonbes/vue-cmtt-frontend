<template>
  <div class="ep-island">
    <div class="entry-page__link-block">
      <link-component
        :title="title"
        :description="description"
        :urlSrc="urlSrc"
        :sourceIcon="sourceIcon"
        :availability="availability"
      />
    </div>
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
    availability: Boolean,
  },
};
</script>

<style lang="scss">
.entry-page__link-block {
  margin-top: 15px;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .entry-page__link-block {
    margin-left: 15px;
    margin-right: 15px;
  }
}
</style>
