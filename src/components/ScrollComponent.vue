<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// props
const props = defineProps({
  contentPadding: {
    type: String,
    default: "0",
  },
  contentMaxHeight: {
    type: String,
    required: true,
  },
  thumbTrackYOffset: {
    type: String,
    default: "0",
  },
  thumbTrackRightOffset: {
    type: String,
    default: "0",
  },
  thumbWidth: {
    type: String,
    default: "3px",
  },
});

// state
const state = ref({
  visibleArea: 0,
  scrollbarArea: 0,
  thumbHeight: 0,
});

// refs
const contentRef = ref(null);
const thumbTrackRef = ref(null);
const thumbRef = ref(null);

// methods
const calculateVisibleArea = () => {
  state.value.visibleArea =
    thumbTrackRef.value.clientHeight / contentRef.value.scrollHeight;
};

const setScrollbarVisibility = () => {
  if (contentRef.value.clientHeight / contentRef.value.scrollHeight >= 1) {
    thumbTrackRef.value.style.display = "none";
  }
};

const calculateThumbHeight = () => {
  if (state.value.visibleArea >= 1) {
    state.value.thumbHeight = 0;
  } else {
    state.value.thumbHeight =
      contentRef.value.clientHeight * state.value.visibleArea;
  }
};

const scrollHandler = () => {
  let scrollTop = contentRef.value.scrollTop;
  let scrollHeight = contentRef.value.scrollHeight;
  let clientHeight = thumbTrackRef.value.clientHeight;

  let thumbTop = (scrollTop / scrollHeight) * clientHeight;
  thumbTop = Math.min(thumbTop, clientHeight - state.value.thumbHeight);

  thumbRef.value.style.top = Math.round(thumbTop) + "px";
};

const createScrollbar = () => {
  contentRef.value.addEventListener("scroll", scrollHandler, { passive: true });

  calculateVisibleArea();
  setScrollbarVisibility();
  calculateThumbHeight();

  thumbRef.value.style.height = Math.round(state.value.thumbHeight) + "px";
};

const updateScrollbar = () => {
  calculateVisibleArea();
  setScrollbarVisibility();
  calculateThumbHeight();

  thumbRef.value.style.height = Math.round(state.value.thumbHeight) + "px";
};

const removeScrollbar = () => {
  contentRef.value.removeEventListener("scroll", scrollHandler);
};

onMounted(() => {
  createScrollbar();
});

onBeforeUnmount(() => {
  removeScrollbar();
});
</script>

<template>
  <div class="scrollbar-component">
    <div class="content" ref="contentRef" v-resize="updateScrollbar">
      <slot></slot>
    </div>
    <div class="thumb-track" ref="thumbTrackRef">
      <div class="thumb" ref="thumbRef"></div>
    </div>
  </div>
</template>

<style lang="scss">
.scrollbar-component {
  display: flex;
  overflow: hidden;

  .content {
    padding: v-bind("props.contentPadding");
    max-height: v-bind("props.contentMaxHeight");
    overflow-y: scroll;
    scrollbar-width: none;
    overscroll-behavior: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .thumb-track {
    position: relative;
    right: v-bind("props.thumbTrackRightOffset");
    margin: v-bind("props.thumbTrackYOffset") 0;

    .thumb {
      position: absolute;
      top: 0;
      right: 0;
      width: v-bind("props.thumbWidth");
      background: var(--scrollbar-thumb-bg);
      border-radius: 8px;
    }
  }
}
</style>