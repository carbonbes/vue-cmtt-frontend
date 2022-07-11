<template>
  <div class="entry-page__quote-block">
    <quote-component
      :text="text"
      :avatarSrc="avatarSrc"
      :authorSrc="authorSrc"
      :bio="bio"
      :textSizeSrc="textSizeSrc"
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
    textSizeSrc: String,
  },
};
</script>

<style lang="scss">
.entry-page__quote-block {
  --border-radius: 8px;

  margin: 15px auto;
  max-width: 640px;

  .quote-component {
    border-radius: var(--border-radius);
  }
}

@media screen and (max-width: 641px) {
  .entry-page__quote-block {
    --border-radius: 0;
  }
}
</style>