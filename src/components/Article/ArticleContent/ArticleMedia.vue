<script setup>
import { computed, ref, onMounted } from "vue";
import ImageComponent from "@/components/ImageComponent.vue";
import GalleryComponent from "@/components/Gallery/GalleryComponent.vue";
import VideoComponent from "@/components/VideoComponent.vue";
import сalculateSizes from "@/utils/сalculateSizes";

const mediaRef = ref(null);

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
  if (isImage.value && imgSizes.value.width >= 640) {
    const { width } = сalculateSizes(
      imgSizes.value.width,
      imgSizes.value.height,
      640,
      460
    );

    return width;
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

const videoCalculatedWidth = computed(() => {
  if (isVideo.value && videoSizes.value.width >= 640) {
    const { width } = сalculateSizes(
      videoSizes.value.width,
      videoSizes.value.height,
      640,
      460
    );

    return width;
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

const gifCalculatedWidth = computed(() => {
  if (isGif.value && gifSizes.value.width >= 640) {
    const { width } = сalculateSizes(
      gifSizes.value.width,
      gifSizes.value.height,
      640,
      460
    );

    return width;
  }
});

const mqWidth = computed(() => {
  if (isImage.value && !isGallery.value) {
    if (imgSizes.value.width >= 640) {
      return imgCalculatedWidth.value;
    } else {
      return imgSizes.value.width;
    }
  } else if (isVideo.value) {
    if (videoSizes.value.width >= 640) {
      return videoCalculatedWidth.value;
    } else {
      return videoSizes.value.width;
    }
  } else if (isGif.value) {
    if (gifSizes.value.width >= 640) {
      return gifCalculatedWidth.value;
    } else {
      return gifSizes.value.width;
    }
  }
});

const mqUuid = computed(() => {
  if (isImage.value && !isGallery.value) {
    return imgUuid.value;
  } else if (isVideo.value) {
    return videoUuid.value;
  } else if (isGif.value) {
    return gifUuid.value;
  }
});

const mqPadding = computed(() => {
  if (isImage.value && !isGallery.value) {
    if (imgCalculatedWidth.value === 640) {
      return "0";
    } else {
      return "8px 0";
    }
  } else if (isVideo.value) {
    if (videoCalculatedWidth.value === 640) {
      return "0";
    } else {
      return "8px 0";
    }
  } else if (isGif.value) {
    if (gifCalculatedWidth.value === 640) {
      return "0";
    } else {
      return "8px 0";
    }
  }
});

onMounted(() => {
  if ((isImage.value && !isGallery.value) || isVideo.value || isGif.value) {
    const mediaStyleRef = document.createElement("style");
    mediaStyleRef.textContent = `@media screen and (min-width: ${mqWidth.value}px) { .media_${mqUuid.value} { padding: ${mqPadding.value}; }`;
    mediaRef.value.appendChild(mediaStyleRef);
  }
});
</script>

<template>
  <div
    class="media"
    :class="'media_' + imgUuid"
    v-if="isImage && !isGallery"
    ref="mediaRef"
  >
    <ImageComponent
      :image-src="imgUuid"
      :src-width="imgSizes.width"
      :src-height="imgSizes.height"
      max-width="640"
      max-height="460"
      type="1"
    />
  </div>

  <div
    class="media"
    :class="'media_' + videoUuid"
    v-if="isVideo"
    ref="mediaRef"
  >
    <VideoComponent
      :src-video="videoUuid"
      :src-width="videoSizes.width"
      :src-height="videoSizes.height"
      max-width="640"
      max-height="460"
      :external-service="props.media.data.video.data.external_service"
    />
  </div>

  <div class="media" :class="'media_' + gifUuid" v-if="isGif" ref="mediaRef">
    <VideoComponent
      :src-video="gifUuid"
      :src-width="gifSizes.width"
      :src-height="gifSizes.height"
      max-width="640"
      max-height="460"
    />
  </div>

  <div class="media" v-if="isGallery">
    <GalleryComponent :src-images="props.media.data.items" type="entry" />
  </div>
</template>