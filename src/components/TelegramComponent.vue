<template>
  <div class="embed">
    <div class="embed-header">
      <img class="embed-header__author-avatar" :src="authorAvatar" alt="" />
      <div class="embed-header__data">
        <span class="embed-header__author-name">{{ authorName }}</span>
        <date-time
          :date="dateTime"
          :title="new Date(dateTime * 1000).toLocaleString()"
        />
      </div>
      <div class="spacer" />
      <div class="embed-header__logo">
        <telegram-logo class="telegram-logo" />
      </div>
    </div>
    <div class="embed-text" v-html="text" v-if="text"></div>
    <div class="embed-cover" v-if="imgCover || videoCover">
      <img :src="imgCover" alt="" v-if="imgCover" />
      <video controls playsinline v-if="videoCover">
        <source :src="videoCover" />
      </video>
    </div>
  </div>
</template>

<script>
import DateTime from "./DateTime.vue";
import TelegramLogo from "@/assets/logos/telegram_logo.svg?inline";

export default {
  components: { DateTime, TelegramLogo },

  props: {
    authorAvatar: String,
    authorName: String,
    dateTime: [String, Number],
    text: String,
    imgCover: String,
    videoCover: String,
  },
};
</script>