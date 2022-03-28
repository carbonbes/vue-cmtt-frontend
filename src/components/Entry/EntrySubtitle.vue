<template>
  <p v-html="collapsedString || replacedString"></p>
</template>

<script>
export default {
  props: {
    string: String,
  },

  data() {
    return {
      collapsedString: null,
    };
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

    collapsedString() {
      if (this.replacedString.length > 300) {
        return this.collapsedString = this.replacedString.slice(0, 300) + "...";
      }
    },
  },
};
</script>