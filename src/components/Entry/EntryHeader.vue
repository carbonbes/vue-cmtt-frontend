<template>
  <div class="entry-header">
    <div
      class="entry-header__subsite-data entry-header__item"
      @mouseenter="showPopup"
      @mouseleave="hidePopup"
    >
      <div
        class="entry-header__subsite-avatar"
        :style="{
          'background-image': `url(https://leonardo.osnova.io/${subsiteAvatar}/-/scale_crop/64x64/)`,
        }"
      />
      <span class="entry-header__subsite-name">{{ subsiteName }}</span>
      <transition name="entry-header-subsite-data__popup"
        ><div class="entry-header-subsite-data__popup" v-if="popupVisibled">
          <author-data-popup :data="this.subsiteData" /></div
      ></transition>
    </div>
    <div
      class="entry-header__author-name entry-header__item"
      v-if="!isSameAuthor"
    >
      {{ authorName }}
    </div>
    <time
      class="entry-header__date-publish entry-header__item"
      :title="new Date(date * 1000).toLocaleString()"
      ><date-time :date="date"
    /></time>
  </div>
</template>

<script>
import DateTime from "@/components/DateTime.vue";
import AuthorDataPopup from "../AuthorDataPopup.vue";

export default {
  components: {
    DateTime,
    AuthorDataPopup,
  },

  props: {
    subsiteData: Object,
    subsiteType: Number,
    subsiteId: Number,
    subsiteAvatar: String,
    subsiteName: String,
    authorType: Number,
    authorId: Number,
    authorName: String,
    date: Number,
  },

  data() {
    return {
      timeout: null,
      popupisFocus: false,
      popupVisibled: false,
    };
  },

  methods: {
    showPopup() {
      this.popupisFocus = true;
      this.timeout = setTimeout(() => {
        if (this.popupisFocus) this.popupVisibled = true;
      }, 750);
    },

    hidePopup() {
      this.popupisFocus = false;
      this.popupVisibled = false;
    },
  },

  computed: {
    isSameAuthor() {
      return this.subsiteId === this.authorId;
    },
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
}

.entry-header__item {
  display: flex;
  align-items: center;
  white-space: nowrap;

  &:not(:last-child) {
    margin-right: 20px;
  }
}

.entry-header__subsite-data {
  position: relative;
  justify-content: center;
}

.entry-header__subsite-avatar {
  margin-right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
  background-size: 100% auto;
  background-repeat: no-repeat;
  image-rendering: -webkit-optimize-contrast;
}

.entry-header__subsite-name {
  font-weight: 500;
}

.entry-header-subsite-data__popup {
  position: absolute;
  top: 100%;
  margin-top: 10px;
  width: 325px;
  min-height: 250px;
  cursor: auto;

  &-enter-active,
  &-leave-active {
    transition: opacity 0.15s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

.entry-header__author-name,
.entry-header__date-publish {
  font-size: 15px;
}

.entry-header__author-name,
.entry-header__date-publish {
  position: relative;
  z-index: 1;
}

.entry-header__subsite-data,
.entry-header__author-name,
.entry-header__date-publish {
  cursor: pointer;
}

.entry-header__author-name {
  max-width: 200px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.entry-header__date-publish {
  max-width: 125px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--grey-color);
}

@media (hover: hover) {
  .entry-header__subsite-data,
  .entry-header__author-name,
  .entry-header__date-publish {
    &:hover {
      .entry-header__subsite-name {
        color: var(--blue-color);
      }
    }
  }

  .entry-header__subsite-data {
    &:hover {
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
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>