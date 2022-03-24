<template>
  <div class="person-component">
    <img class="avatar" :src="avatar" alt="" v-if="avatar" />
    <div class="name" v-text="name"></div>
    <div class="description" v-text="description"></div>
  </div>
</template>

<script>
export default {
  props: {
    avatarSrc: String,
    name: String,
    description: String,
  },

  computed: {
    avatar() {
      if (this.avatarSrc) {
        return `https://leonardo.osnova.io/${this.avatarSrc}/-/scale_crop/300x300/-/format/webp/`;
      }
    },
  },
};
</script>