<template>
  <div class="link-embed e-island">
    <LinkComponent
      :title="linkTitle"
      :description="linkDescription"
      :urlSrc="linkSrc"
      :sourceIcon="linkIcon"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import LinkComponent from "../../LinkComponent.vue";

// props
const props = defineProps(["link"]);

// computed
const linkTitle = computed(() => props.link.data.link.data.title);
const linkDescription = computed(() => props.link.data.link.data.description);
const linkSrc = computed(() => props.link.data.link.data.url);
const linkIcon = computed(() => props.link.data.link.data.image?.data.uuid);
</script>