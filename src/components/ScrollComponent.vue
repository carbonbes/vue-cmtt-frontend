<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// props
const props = defineProps({
  contentMaxHeight: {
    type: String,
  },
  thumbWidth: {
    type: String,
    default: "3px",
  },
});

// computed
const visibleArea = computed(
  () => contentRef.value.clientHeight / contentRef.value.scrollHeight
);
const thumbHeight = computed(() => {
  if (visibleArea.value >= 1) {
    return 0;
  } else {
    return contentRef.value.clientHeight * visibleArea.value;
  }
});

// methods
const scrollHandler = () => {
  let scrollTop = contentRef.value.scrollTop;
  let scrollHeight = contentRef.value.scrollHeight;
  let clientHeight = contentRef.value.clientHeight;

  let thumbTop = (scrollTop / scrollHeight) * clientHeight;
  thumbTop = Math.min(thumbTop, clientHeight - thumbHeight.value);

  thumbRef.value.style.top = Math.round(thumbTop) + "px";
};

// refs
const contentRef = ref(null);
const thumbRef = ref(null);

onMounted(() => {
  contentRef.value.addEventListener("scroll", scrollHandler, { passive: true });

  thumbRef.value.style.height = Math.round(thumbHeight.value) + "px";
});

onBeforeUnmount(() => {
  contentRef.value.removeEventListener(
    "scroll",
    contentRef.value.scrollHandler
  );
});
</script>

<template>
  <div class="scrollbar-component">
    <div class="content" ref="contentRef">
      <slot></slot>
    </div>
    <div class="thumb" ref="thumbRef"></div>
  </div>
</template>

<style lang="scss">
.scrollbar-component {
  position: relative;

  .content {
    max-height: v-bind("props.contentMaxHeight");
    overflow-y: scroll;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .thumb {
    position: absolute;
    top: 0;
    right: 0;
    width: v-bind("props.thumbWidth");
    background: var(--scrollbar-thumb-bg);
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.2s;
  }
}

@media (hover: hover) {
  .scrollbar-component {
    &:hover {
      .thumb {
        opacity: 1;
      }
    }
  }
}
</style>