<template>
  <div class="entry-header">
    <div
      class="entry-header__subsite-data entry-header__item"
      @mouseenter="showSubsitePopup"
      @mouseleave="hideSubsitePopup"
    >
      <div
        class="entry-header__subsite-avatar"
        :style="{
          'background-image': `url(https://leonardo.osnova.io/${subsiteAvatar}/-/scale_crop/64x64/)`,
        }"
      />
      <span class="entry-header__subsite-name">{{ subsiteName }}</span>
      <transition name="entry-header-subsite-data__popup"
        ><div
          class="
            entry-header-subsite-data__popup
            entry-header-subsite-data__popup_bottom
          "
          v-if="subsitePopupVisibled"
        >
          <profile-popup
            :data="this.subsiteData"
            :isSubscribed="this.subsiteData.isSubscribed"
          /></div
      ></transition>
    </div>
    <div
      class="entry-header__author-data entry-header__item"
      @mouseenter="showAuthorPopup"
      @mouseleave="hideAuthorPopup"
      v-if="!isSameAuthor"
    >
      <div class="entry-header__author-name">
        {{ authorName }}
      </div>
      <transition name="entry-header-subsite-data__popup"
        ><div
          class="
            entry-header-subsite-data__popup
            entry-header-subsite-data__popup_bottom
          "
          v-if="authorPopupVisibled"
        >
          <profile-popup
            :data="this.authorData"
            :isSubscribed="this.authorData.isSubscribed"
          /></div
      ></transition>
    </div>
    <time
      class="entry-header__date-publish entry-header__item"
      :title="new Date(date * 1000).toLocaleString()"
      ><date-time :date="date * 1000" :type="dateType"
    /></time>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DateTime from "@/components/DateTime.vue";
import ProfilePopup from "../ProfilePopup.vue";

export default {
  components: {
    DateTime,
    ProfilePopup,
  },

  props: {
    subsiteData: Object,
    subsiteType: Number,
    subsiteId: Number,
    subsiteAvatar: String,
    subsiteName: String,
    authorData: Object,
    authorType: Number,
    authorId: Number,
    authorName: String,
    date: [String, Number],
    dateType: String,
  },

  data() {
    return {
      timeout: null,
      subsitePopupIsFocus: false,
      authorPopupIsFocus: false,
      subsitePopupVisibled: false,
      authorPopupVisibled: false,
    };
  },

  methods: {
    showSubsitePopup() {
      if (this.isAuth) {
        this.subsitePopupIsFocus = true;
        this.timeout = setTimeout(() => {
          if (this.subsitePopupIsFocus) this.subsitePopupVisibled = true;
        }, 750);
      }
    },

    hideSubsitePopup() {
      this.subsitePopupIsFocus = false;
      this.subsitePopupVisibled = false;
    },

    showAuthorPopup() {
      if (this.isAuth) {
        this.authorPopupIsFocus = true;
        this.timeout = setTimeout(() => {
          if (this.authorPopupIsFocus) this.authorPopupVisibled = true;
        }, 750);
      }
    },

    hideAuthorPopup() {
      this.authorPopupIsFocus = false;
      this.authorPopupVisibled = false;
    },
  },

  computed: {
    isSameAuthor() {
      return this.subsiteId === this.authorId;
    },

    ...mapGetters(["isAuth"]),
  },

  beforeUnmount() {
    clearTimeout(this.timeout);
  },
};
</script>

<style lang="scss">
.entry-header {
  display: flex;
  align-items: center;

  &__item {
    display: flex;
    align-items: center;
    white-space: nowrap;

    &:not(:last-child) {
      margin-right: 20px;
    }
  }

  &__subsite-data,
  &__author-data {
    position: relative;
    justify-content: center;
  }

  &__subsite-avatar {
    margin-right: 10px;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
    background-size: 100% auto;
    background-repeat: no-repeat;
    image-rendering: -webkit-optimize-contrast;
  }

  &__subsite-name {
    font-weight: 500;
  }

  &__author-name,
  &__date-publish {
    position: relative;
    font-size: 15px;
    z-index: 1;
  }

  &__subsite-data,
  &__author-data,
  &__author-name,
  &__date-publish {
    cursor: pointer;
  }

  &__author-name {
    max-width: 200px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__date-publish {
    max-width: 125px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--grey-color);
  }
}

.entry-header-subsite-data__popup {
  position: absolute;
  width: 325px;
  cursor: auto;
  z-index: 2;

  &_top {
    bottom: 100%;
    margin-bottom: 10px;
  }

  &_bottom {
    top: 100%;
    margin-top: 10px;
  }

  &-enter-active,
  &-leave-active {
    transition: opacity 0.15s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

@media (hover: hover) {
  .entry-header__subsite-data,
  .entry-header__author-data,
  .entry-header__date-publish {
    &:hover {
      color: var(--blue-color);
    }
  }

  .entry-header__subsite-data,
  .entry-header__author-data {
    &:hover {
      z-index: 2;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        width: 100%;
        height: 50px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .entry-header__item:not(:last-child) {
    margin-right: 12px;
  }

  .entry-header__subsite-avatar {
    margin-right: 8px;
  }

  .entry-header__subsite-name {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entry-header__author-name {
    white-space: nowrap;
    max-width: 125px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entry-header__date-publish {
    white-space: nowrap;
    max-width: 125px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>