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
      <div class="embed-header__logo"><telegram-logo /></div>
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
import TelegramLogo from "@/assets/logos/telegram_logo.svg";

export default {
  components: { DateTime },

  props: {
    data: Object,
  },

  computed: {
    authorAvatar() {
      return this.data[0].data.telegram.data.tg_data.author.avatar_url;
    },

    authorName() {
      return this.data[0].data.telegram.data.tg_data.author.name;
    },

    dateTime() {
      return this.data[0].data.telegram.data.tg_data.datetime;
    },

    text() {
      return this.data[0].data.telegram.data.tg_data.text;
    },

    views() {
      return this.data[0].data.telegram.data.tg_data.views;
    },

    imgCover() {
      return this.data[0].data.telegram.data.tg_data.photos[0]?.leonardo_url;
    },

    videoCover() {
      return this.data[0].data.telegram.data.tg_data.videos[0]?.src;
    },
  },
};
</script>

<style lang="scss">
.embed {
  margin-top: 7px;
  display: flex;
  flex-flow: column;
  box-shadow: 0 0 1px #00000080;
  border-radius: 8px;
  line-height: normal;
}

.embed-header {
  margin: 15px 20px;
  display: flex;
  align-items: center;
}

.embed-header__data {
  margin-left: 10px;

  & .date-time {
    font-size: 13px;
    color: var(--grey-color);
  }
}

.embed-header__author-name {
  font-weight: 700;
}

.embed-header__author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.embed-text {
  margin: 0 20px 15px;
  font-size: 18px;
  line-height: 26px;

  & b {
    font-weight: 400;
  }
}

.embed-cover {
  & img,
  video {
    width: 100%;
    display: block;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  & video {
    max-height: 600px;
    background: var(--grey-color);
    cursor: pointer;
  }
}
</style>