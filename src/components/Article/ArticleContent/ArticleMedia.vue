<script setup>
import { computed } from "vue";
import ImageComponent from "@/components/ImageComponent.vue";
import GalleryComponent from "@/components/Gallery/GalleryComponent.vue";
import VideoComponent from "@/components/VideoComponent.vue";
import { сalculateAspectRatio } from "@/utils/сalculateAspectRatio";

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

const imgCalculatedWidth = computed(() => {
  if (isImage.value) {
    const { width } = сalculateAspectRatio(
      props.media.data.items[0].image.data.width,
      props.media.data.items[0].image.data.height,
      640,
      600
    );

    return width;
  }
});

const imageClassObj = computed(() => {
  if (isImage.value) {
    return {
      media_wide:
        imgSizes.value.width >= 640 &&
        imgSizes.value.width > imgSizes.value.height,
      media_thin:
        imgSizes.value.width < 640 ||
        imgCalculatedWidth.value < 640 ||
        imgSizes.value.height > imgSizes.value.width,
    };
  }
});

const isVideo = computed(() => props.media.type === "video");

const videoUuid = computed(() => {
  if (isVideo.value) {
    return props.media.data.video.data.thumbnail.data.uuid;
  }
});

const videoSizes = computed(() => {
  if (isVideo.value) {
    return {
      width: props.media.data.video.data.width,
      height: props.media.data.video.data.height,
    };
  }
});

const videoClassObj = computed(() => {
  if (isVideo.value) {
    return {
      media_wide:
        videoSizes.value.width >= 640 &&
        videoSizes.value.width > videoSizes.value.height,
      media_thin:
        videoSizes.value.width < 640 ||
        videoSizes.value.height > videoSizes.value.width,
    };
  }
});

const isGif = computed(
  () =>
    props.media.type === "media" &&
    props.media.data.items[0].image.data.type === "gif"
);

const gifUuid = computed(() => {
  if (isGif.value) {
    return props.media.data.items[0].image.data.uuid;
  }
});

const gifSizes = computed(() => {
  if (isGif.value) {
    return {
      width: props.media.data.items[0].image.data.width,
      height: props.media.data.items[0].image.data.height,
    };
  }
});

const gifClassObj = computed(() => {
  if (isGif.value) {
    return {
      media_wide:
        gifSizes.value.width >= 640 &&
        gifSizes.value.width > gifSizes.value.height,
      media_thin:
        gifSizes.value.width < 640 ||
        gifSizes.value.height > gifSizes.value.width,
    };
  }
});
</script>

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
      :srcVideo="videoUuid"
      :srcWidth="props.media.data.video.data.width"
      :srcHeight="props.media.data.video.data.height"
      :maxWidth="640"
      :maxHeight="600"
      :externalService="props.media.data.video.data.external_service"
    />
  </div>

  <div class="media" :class="gifClassObj" v-if="isGif">
    <VideoComponent
      :srcVideo="gifUuid"
      :srcWidth="props.media.data.items[0].image.data.width"
      :srcHeight="props.media.data.items[0].image.data.height"
      :maxWidth="640"
      :maxHeight="600"
    />
  </div>

  <div class="media" v-if="isGallery">
    <GalleryComponent :srcImages="props.media.data.items" type="entry" />
  </div>
</template>