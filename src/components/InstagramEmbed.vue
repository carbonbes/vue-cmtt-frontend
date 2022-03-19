<template>
  <div class="embed">
    <iframe
      allowfullscreen="allowfullscreen"
      :src="`${url}/embed`"
      ref="embed"
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    url: String,
  },

  computed: {
    embedHeight() {
      return this.$refs.embed.clientHeight;
    },
  },
};
</script>