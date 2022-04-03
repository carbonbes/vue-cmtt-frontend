<template>
  <template v-for="(media, index) in attachments" :key="index">
    <image-component
      :image="media.data.uuid"
      :srcWidth="media.data.width"
      :srcHeight="media.data.height"
      maxWidth="400"
      maxHeight="300"
      v-if="
        media.type === 'image' &&
        (media.data.type === 'jpg' ||
          media.data.type === 'png' ||
          media.data.type === 'webp')
      "
    />

    <video-component
      :srcVideo="media.data.uuid"
      :srcWidth="media.data.width"
      :srcHeight="media.data.height"
      maxWidth="400"
      maxHeight="300"
      v-if="
        (media.type === 'image' || media.type === 'movie') &&
        (media.data.type === 'gif' || media.data.type === 'mp4')
      "
    />

    <video-component
      :srcVideo="media.data.uuid"
      :srcWidth="media.data.width"
      :srcHeight="media.data.height"
      maxWidth="400"
      maxHeight="300"
      :externalService="media.data.external_service"
      :embedCover="media.data.thumbnail.data.uuid"
      v-if="media.type === 'video'"
    />
  </template>
</template>

<script>
import ImageComponent from "@/components/ImageComponent.vue";
import VideoComponent from "@/components/VideoComponent.vue";

export default {
  props: {
    attachments: Object,
  },

  components: {
    ImageComponent,
    VideoComponent,
  },
};
</script>