<template>
  <div class="gallery" id="gallery-component" :class="galleryClassObj">
    <template v-for="(item, index) in images" :key="index">
      <GalleryItem
        :class="{ gallery__item_more: index >= 4 && props.images.length > 5 }"
        :srcImage="item.image.data.uuid"
        :srcWidth="item.image.data.width"
        :srcHeight="item.image.data.height"
        v-show="index <= 4"
        :data-more="props.images.length - index"
      />
    </template>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, onUnmounted } from "vue";
import GalleryItem from "./GalleryItem.vue";
import PhotoSwipeLightbox from "photoswipe/dist/photoswipe-lightbox.esm.min.js";

// props
const props = defineProps({
  images: Object,
});

// state
const state = reactive({
  lightbox: null,
});

// mounted
onMounted(() => {
  if (!state.lightbox) {
    state.lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-component",
      children: "a",
      pswpModule: () => import("photoswipe/dist/photoswipe.esm.min.js"),
      showHideAnimationType: "none",
      zoomAnimationDuration: false,
    });
    state.lightbox.init();
  }
});

// computed
const galleryClassObj = computed(() => {
  if (props.images.length === 2) {
    return "gallery_2";
  } else if (props.images.length === 3) {
    return "gallery_3";
  } else if (props.images.length === 4) {
    return "gallery_4";
  } else if (props.images.length >= 5) {
    return "gallery_5";
  }
});

// unmounted
onUnmounted(() => {
  if (state.lightbox) {
    state.lightbox.destroy();
    state.lightbox = null;
  }
});
</script>

<style lang="scss">
.gallery {
  display: grid;
  grid-gap: 4px;

  &__item {
    box-shadow: inset 0 0 11px rgb(0 0 0 / 10%);
    cursor: zoom-in;

    &_more {
      position: relative;

      &::after {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.5);
        content: "+" attr(data-more);
        color: #fff;
        font-size: 40px;
      }
    }

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &_2 {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 400px;

    & .gallery__item {
      grid-column: 1 span;
      grid-row: 1 span;
    }
  }

  &_3 {
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(2, 250px);

    & .gallery__item {
      grid-column: 2 span;
      grid-row: 1 span;

      &:first-child {
        grid-column: 4 span;
        grid-row: 2 span;
      }
    }
  }

  &_4 {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 150px);

    & .gallery__item {
      &:first-child {
        grid-column: 2 span;
        grid-row: 3 span;
      }
    }
  }

  &_5 {
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(2, 250px);

    & .gallery__item {
      grid-column: 2 span;

      &:first-child {
        grid-column: 3 span;
        grid-row: 1 span;
      }

      &:nth-child(2) {
        grid-column: 3 span;
        grid-row: 1 span;
      }
    }
  }
}
</style>