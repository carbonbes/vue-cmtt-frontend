<template>
  <p v-html="collapsedStringFormatted || replacedString"></p>
</template>

<script>
export default {
  props: {
    string: String,
  },

  computed: {
    replacedString() {
      return this.string
        .replace(/\\/g, "")
        .replace(
          /(\[(.*?)\])\((https?\:\/\/.*?)\)/g,
          "<a href='$3' target='_blank'>$2</a>"
        );
    },

    collapsedStringFormatted() {
      if (this.replacedString.length > 300) {
        return this.replacedString.slice(0, 300) + "...";
      }
    },
  },
};
</script>