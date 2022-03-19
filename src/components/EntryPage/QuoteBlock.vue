<template>
  <div class="entry-page__quote-block">
    <quote-component
      :text="text"
      :avatarSrc="avatarSrc"
      :author="author"
      :bio="bio"
    />
  </div>
</template>

<script>
import QuoteComponent from "@/components/QuoteComponent.vue";

export default {
  components: { QuoteComponent },

  props: {
    avatarSrc: String,
    author: String,
    bio: String,
    text: String,
  },
};
</script>

<style lang="scss">
.entry-page__quote-block {
  margin: 15px auto;
  max-width: 680px;
}
</style>