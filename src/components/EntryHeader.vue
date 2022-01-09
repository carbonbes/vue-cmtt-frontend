<template>
  <div class="entry-header">
    <div class="entry-header__subsite-data entry-header__item">
      <div
        class="entry-header__subsite-avatar"
        :style="{
          'background-image': `url(https://leonardo.osnova.io/${subsiteAvatar}/-/scale_crop/64x64/)`,
        }"
      ></div>
      <span class="entry-header__subsite-name">{{ subsiteName }}</span>
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

export default {
  components: {
    DateTime,
  },

  props: {
    subsiteType: Number,
    subsiteId: Number,
    subsiteAvatar: String,
    subsiteName: String,
    authorType: Number,
    authorId: Number,
    authorName: String,
    date: Number,
  },

  computed: {
    isSameAuthor() {
      return this.subsiteId === this.authorId;
    },
  },
};
</script>

<style>
.entry-header {
  display: flex;
  align-items: center;
}

.entry-header__item {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.entry-header__item:not(:last-child) {
  margin-right: 20px;
}

.entry-header__subsite-data {
  font-weight: 500;
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

.entry-header__author-name,
.entry-header__date-publish {
  font-size: 15px;
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

@media screen and (max-width: 768px) {
  .entry-header__subsite-name {
    max-width: 75px;
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