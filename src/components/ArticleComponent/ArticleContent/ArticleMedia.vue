<template>
  <div class="media" :class="imageClassObj" v-if="isImage && !isGallery">
    <ImageComponent
      :imageSrc="imgUuid"
      :srcWidth="imgSizes.width"
      :srcHeight="imgSizes.height"
      :maxWidth="640"
      :maxHeight="600"
      type="1"
    />
  </div>

  <div class="media" :class="videoClassObj" v-if="isVideo">
    <VideoComponent
      :srcVideo="props.media.data.video.data.thumbnail.data.uuid"
      :srcWidth="props.media.data.video.data.width"
      :srcHeight="props.media.data.video.data.height"
      :maxWidth="640"
      :maxHeight="600"
      :externalService="props.media.data.video.data.external_service"
    />
  </div>

  <div class="media" :class="gifClassObj" v-if="isGif">
    <VideoComponent
      :srcVideo="props.media.data.items[0].image.data.uuid"
      :srcWidth="props.media.data.items[0].image.data.width"
      :srcHeight="props.media.data.items[0].image.data.height"
      :maxWidth="640"
      :maxHeight="600"
    />
  </div>

  <div class="media" v-if="!isImage && isGallery">
    <GalleryComponent :srcImages="props.media.data.items" type="entry" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import ImageComponent from "@/components/ImageComponent.vue";
import GalleryComponent from "@/components/Gallery/GalleryComponent.vue";
import VideoComponent from "@/components/VideoComponent.vue";

// props
const props = defineProps(["media"]);

// computed
const isGallery = computed(
  () => props.media.type === "media" && props.media.data.items.length > 1
);

const isImage = computed(
  () =>
    props.media.type === "media" &&
    (props.media.data.items[0].image.data.type === "jpg" ||
      props.media.data.items[0].image.data.type === "png" ||
      props.media.data.items[0].image.data.type === "webp")
);

const imgUuid = computed(() => {
  if (isImage.value) {
    return props.media.data.items[0].image.data.uuid;
  }
});

const imgSizes = computed(() => {
  if (isImage.value) {
    return {
      width: props.media.data.items[0].image.data.width,
      height: props.media.data.items[0].image.data.height,
    };
  }
});

const imageClassObj = computed(() => {
  if (isImage.value) {
    return {
      media_wide: imgSizes.value.width >= 640,
      media_thin:
        imgSizes.value.width < 640 ||
        imgSizes.value.height > imgSizes.value.width,
    };
  }
});

const isVideo = computed(() => props.media.type === "video");

const videoClassObj = computed(() => {
  if (isVideo.value) {
    return {
      media_wide: props.media.data.video.data.width >= 640,
      media_thin:
        props.media.data.video.data.width < 640 ||
        props.media.data.video.data.height > props.media.data.video.data.width,
    };
  }
});

const isGif = computed(
  () =>
    props.media.type === "media" &&
    props.media.data.items[0].image.data.type === "gif"
);

const gifClassObj = computed(() => ({
  media_wide: props.media.data.items[0].image.data.width >= 640,
  media_thin:
    props.media.data.items[0].image.data.width < 640 ||
    props.media.data.items[0].image.data.height >
      props.media.data.items[0].image.data.width,
}));
</script>