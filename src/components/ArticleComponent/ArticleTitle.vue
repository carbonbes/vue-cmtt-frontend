<script setup>
import { computed } from "vue";
import CheckIcon from "@/assets/logos/check_icon.svg?inline";

// props
const props = defineProps(["title", "isEditorial"]);

// computed
const titleWithoutLastWord = computed(() => {
  if (props.isEditorial) {
    return props.title.lastIndexOf(" ");
  }
});

const lastWord = computed(() => {
  if (props.isEditorial) {
    return props.title.split(" ").pop();
  }
});
</script>

<template>
  <h1 class="article__title" v-if="props.title && props.isEditorial">
    {{ props.title.substring(0, titleWithoutLastWord) + " " }}
    <div class="editorial-icon" title="Статья от редакции">
      {{ lastWord }}
      <CheckIcon class="icon"></CheckIcon>
    </div>
  </h1>

  <h1 class="article__title" v-if="props.title && !isEditorial">
    {{ props.title }}
  </h1>
</template>

<style lang="scss">
.article__title .editorial-icon {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.article__title .editorial-icon .icon {
  width: 25px;
  height: 25px;
  stroke-width: 2.75;
  color: var(--brand-color);
}
</style>