<script setup>
import { ref, computed } from "vue";

// state
const isVisible = ref(false);

// props
const props = defineProps({
  userId: [Number, String],
  avatarUrl: String,
  userName: String,
  sign: Number,
  popupRef: Object,
});

// computed
const itemAvatarStyleObj = computed(() => {
  if (isVisible.value) {
    return { "background-image": `url(${props.avatarUrl})` };
  }
});

const nicknameClassObj = computed(() => ({
  "item-nickname_positive": props.sign === 1,
  "item-nickname_negative": props.sign === -1,
}));

// methods
const setIsVisible = () => {
  isVisible.value = true;
};
</script>

<template>
  <router-link
    class="likes-popup__item"
    :to="{ path: '/u/' + props.userId }"
    v-intersect="{
      type: 'when-appears',
      callback: setIsVisible,
      root: props.popupRef,
      threshold: 0,
    }"
  >
    <div class="item-avatar" :style="itemAvatarStyleObj"></div>
    <span class="item-nickname" :class="nicknameClassObj">{{
      props.userName
    }}</span>
  </router-link>
</template>