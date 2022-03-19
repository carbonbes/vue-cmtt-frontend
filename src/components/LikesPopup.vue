<template>
  <div class="likes-popup">
    <template v-for="(like, index) in this.likes" :key="index">
      <template v-if="this.type === 'entry'">
        <div class="likes-popup__item">
          <div class="item__avatar" :style="{ backgroundImage: url(`${like.avatar_url}-/scale_crop/50x50/-/format/webp/`) }"></div>
          <span class="item__nickname">{{ like.user_name }}</span>
        </div>
      </template>

      <template v-if="this.type === 'comment'">
        <div class="likes-popup__item">
          <div class="item__avatar" :style="{ backgroundImage: url(`${like.avatar_url}-/scale_crop/50x50/-/format/webp/`) }"></div>
          <span class="item__nickname">{{ like.name }}</span>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    likes: Object,
    type: String,
  },
};
</script>

<style lang="scss">
</style>