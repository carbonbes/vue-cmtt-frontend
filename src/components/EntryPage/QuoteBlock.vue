<template>
  <div class="entry-page__quote-block">
    <quote-component
      :text="text"
      :avatarSrc="avatarSrc"
      :authorSrc="authorSrc"
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
    authorSrc: String,
    bio: String,
    text: String,
    textSize: String,
  },
};
</script>

<style lang="scss">
.entry-page__quote-block {
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 15px;
  max-width: 640px;
}
</style>