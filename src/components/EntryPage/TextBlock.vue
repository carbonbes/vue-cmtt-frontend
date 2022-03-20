<template>
  <div class="entry-page__text-block ep-island">
    <p v-html="processed"></p>
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

    processed() {
      return this.text.replace(
        /(\[(.*?)\])\((https?\:\/\/.*?)\)/g,
        '<a href="$3" target="_blank">$2</a>'
      );
    },
  },
};
</script>

<style lang="scss">
.entry-page__text-block {
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

  & a {
    color: var(--blue-color);
    border-bottom: 1px solid var(--link-text-decoration-color);
    cursor: pointer;
  }
}

@media (hover: hover) {
  .entry-page__text-block {
    & a {
      &:hover {
        color: var(--red-color);
        border-bottom: 1px solid var(--link-text-decoration-color-hover);
      }
    }
  }
}
</style>