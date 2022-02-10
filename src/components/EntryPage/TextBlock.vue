<template>
  <div class="entry-page__text-block ep-island">
    <p>{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },

  computed: {
    text() {
      return this.item.data.text;
    },
  },
};
</script>

<style lang="scss">
.entry-page__text-block:first-child {
  & p {
    margin-top: 0;
  }
}
</style>