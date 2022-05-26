<template>
  <div class="gallery" id="gallery-component" :class="galleryClassObj">
    <template v-for="(item, index) in images" :key="index">
      <GalleryItem
        :class="{
          gallery__item_more: index >= 4 && props.srcImages.length > 5,
        }"
        :srcImage="item.url"
        :srcWidth="item.width"
        :srcHeight="item.height"
        v-show="index <= 4"
        :data-more="props.srcImages.length - index"
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
  srcImages: Object,
  type: String,
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
  if (props.srcImages.length === 2) {
    return "gallery_2";
  } else if (props.srcImages.length === 3) {
    return "gallery_3";
  } else if (props.srcImages.length === 4) {
    return "gallery_4";
  } else if (props.srcImages.length >= 5) {
    return "gallery_5";
  }
});

const images = computed(() => {
  if (props.type === "entry_page" || props.type === "entry") {
    return props.srcImages.map((item) => {
      let accum = {};
      accum.url = null;
      accum.width = null;
      accum.height = null;

      accum.url = `https://leonardo.osnova.io/${item.image.data.uuid}`;
      accum.width = item.image.data.width;
      accum.height = item.image.data.height;

      return accum;
    });
  } else if (props.type === "twitter_embed") {
    return props.srcImages.map((item) => {
      let accum = {};
      accum.url = null;
      accum.width = null;
      accum.height = null;

      accum.url = item.media_url_https;
      accum.width = item.sizes.large.w;
      accum.height = item.sizes.large.h;

      return accum;
    });
  } else if (props.type === "telegram_embed") {
    return props.srcImages.map((item) => {
      let accum = {};
      accum.url = null;
      accum.width = null;
      accum.height = null;

      accum.url = item.leonardo_url;
      accum.width = item.width;
      accum.height = item.height;

      return accum;
    });
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
  background: var(--bg-color);

  &__item {
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
    --g2-t-rows-height: 400px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: var(--g2-t-rows-height);

    & .gallery__item {
      grid-column: 1 span;
      grid-row: 1 span;
    }
  }

  &_3 {
    --g3-t-rows-height: 250px;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(2, var(--g3-t-rows-height));

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
    --g5-t-rows-height: 250px;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(2, var(--g5-t-rows-height));

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

@media (max-width: 768px) {
  .gallery {
    &_2 {
      --g2-t-rows-height: 200px;
    }

    &_3 {
      --g3-t-rows-height: 175px;
    }

    &_5 {
      --g5-t-rows-height: 175px;
    }
  }
}
</style>