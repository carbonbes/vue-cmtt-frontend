<template>
  <p v-for="(text, index) in replacedString" :key="index" v-html="text"></p>
</template>

<script>
export default {
  props: {
    string: String,
  },

  computed: {
    replacedString() {
      return this.string
        .replace(/(\[\@(\d+)\|([^\]]+)\])/g, "<a href='u/$2'>@$3</a>")
        .split("\n\n");
    },
  },
};
</script>