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
      return this.string.split("\n\n").map((item) =>
        item
          .replace(/((\s|^)https?\S+)/gm, "<a href='$1' target='_blank'>$1</a>")
          .replace(/(\[\@(\d+)\|([^\]]+)\])/g, "<a href='u/$2'>@$3</a>")
          .replace(/\n/g, "</br>")
      );
    },
  },
};
</script>