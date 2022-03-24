<template>
  <div class="entry-page__quote-block ep-island">
    <quote-component
      :text="text"
      :avatarSrc="avatarSrc"
      :author="author"
      :bio="bio"
      :textSize="textSize"
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
    textSize: String,
  },
};
</script>

<style lang="scss">
.entry-page__quote-block {
  margin-top: 15px;
  margin-bottom: 15px;
  max-width: 680px;
}
</style>