<template>
  <div class="entry-page__text-block ep-island">
    <p v-html="processed"></p>
  </div>
</template>

<script>
import stringReplacement from "@/utils/stringReplacement";

export default {
  props: {
    item: Object,
  },

  computed: {
    text() {
      return this.item.data.text.replace(/\\/g, "").replace(/\n/g, "<br>");
    },

    processed() {
      return stringReplacement(this.text);
    },
  },
};
</script>

<style lang="scss">
.entry-page__text-block {
  margin: 0 auto;
  max-width: 640px;

  &:first-child {
    & p {
      margin-top: 0;
    }
  }

  &:last-child {
    & p {
      margin-bottom: 0;
    }
  }

  & p {
    margin: 12px 0;
  }
}
</style>