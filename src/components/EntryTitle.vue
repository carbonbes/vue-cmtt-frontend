<template>
  <h1 class="entry-title">
    {{ title }}
    <div class="entry-title__editorial" title="Статья от редакции">
      <check-icon class="icon"></check-icon>
    </div>
  </h1>
</template>

<script>
import { CheckIcon } from "@zhuowenli/vue-feather-icons";

export default {
  components: {
    CheckIcon,
  },

  props: {
    title: String,
    isEditorial: Boolean,
  },
};
</script>

<style>
.entry-title__editorial {
  margin-top: -4px;
  display: inline-block;
  line-height: 0;
  vertical-align: middle;
}

.entry-title__editorial .icon {
  width: 25px;
  height: 25px;
  stroke-width: 2.75;
  color: var(--brand-color);
}
</style>