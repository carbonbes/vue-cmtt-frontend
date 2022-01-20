<template>
  <div class="entry-page__text-block ep-island">
    <p>{{ item.data.text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
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