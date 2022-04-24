<template>
  <h1 class="entry-title" v-if="isEditorial">
    {{ title.substring(0, titleWithoutLastWord) + " " }}
    <div class="entry-title__editorial-icon" title="Статья от редакции">
      {{ lastWord }}
      <check-icon class="icon"></check-icon>
    </div>
  </h1>
  <h1 class="entry-title" v-if="!isEditorial">
    {{ title }}
  </h1>
</template>

<script>
import CheckIcon from "@/assets/logos/check_icon.svg?inline";

export default {
  components: {
    CheckIcon,
  },

  props: {
    title: String,
    isEditorial: Boolean,
  },

  computed: {
    titleWithoutLastWord() {
      if (this.isEditorial) {
        return this.title.lastIndexOf(" ");
      }
    },

    lastWord() {
      if (this.isEditorial) {
        return this.title.split(" ").pop();
      }
    },
  },
};
</script>

<style>
.entry-title__editorial-icon {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.entry-title__editorial-icon .icon {
  width: 25px;
  height: 25px;
  stroke-width: 2.75;
  color: var(--brand-color);
}
</style>