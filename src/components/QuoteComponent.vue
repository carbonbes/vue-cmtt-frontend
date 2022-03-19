<template>
  <blockquote class="quote-component">
    <div class="quote-component__content">
      <quoute-icon class="icon" />
      <p class="text" v-text="text"></p>
      <div class="author" v-if="avatarSrc || bio">
        <div class="avatar" :style="avatar" v-if="avatarSrc" />
        <div class="data">
          <span class="name" v-text="author"></span
          ><span class="desctiption" v-text="bio" v-if="bio"></span>
        </div>
      </div>
    </div>
  </blockquote>
</template>

<script>
import QuouteIcon from "@/assets/logos/quote_icon.svg?inline";

export default {
  components: {
    QuouteIcon,
  },

  props: {
    avatarSrc: String,
    author: String,
    bio: String,
    text: String,
  },

  computed: {
    avatar() {
      if (this.avatarSrc) {
        return {
          "background-image": `url(
          https://leonardo.osnova.io/${this.avatarSrc}/-/scale_crop/108x108/-/format/webp/
        )`,
        };
      }
    },
  },
};
</script>