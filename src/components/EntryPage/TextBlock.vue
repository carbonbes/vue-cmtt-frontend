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
      return this.item.data.text.replace(/\\/g, "").replace(/\n/g, "<br>");
    },

    processed() {
      return this.text
        .replace(
          /(\[(.+?)\])\((https?\:\/\/.+?)\)(?=\s)/g,
          '<a href="$3" target="_blank">$2</a>'
        )
        .replace(/(?:\*)\*(.+?)\*(?:\*)/g, "<b>$1</b>")
        .replace(/\*(?!\s)(.+?)(?!\s)\*/gm, "<i>$1</i>")
        .replace(/\\?\\?(#([a-zа-яё0-9_\\]+))/gi, '<a href="/tag/$2">$1</a>');
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