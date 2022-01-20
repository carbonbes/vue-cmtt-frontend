<template>
  <div class="author-data-popup">
    <div class="author-data-popup__cover" :style="cover" v-if="isCover" />
    <div class="author-data-popup__content">
      <div class="author-data-popup__avatar" :style="avatar" />
      <div>
        <div class="author-data-popup__name">{{ name }}</div>
      </div>
      <div class="author-data-popup__description" v-if="description">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
  },

  computed: {
    isCover() {
      return this.data.cover;
    },

    cover() {
      if (this.data.cover.data.uuid && this.data.cover.type === "image") {
        return {
          backgroundImage: `url(https://leonardo.osnova.io/${this.data.cover.data.uuid}/-/scale_crop/1920/-/format/webp/)`,
        };
      }
    },

    avatar() {
      return {
        backgroundImage: `url(https://leonardo.osnova.io/${this.data.avatar.data.uuid}/-/scale_crop/1920/-/format/webp/)`,
      };
    },

    name() {
      return this.data.name;
    },

    description() {
      return this.data.description;
    },
  },
};
</script>

<style lang="scss">
.author-data-popup {
  width: 100%;
  height: 100%;
  background: var(--dropdown-bg-color);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 8px;
}

.author-data-popup__content {
  padding: 15px;
}

.author-data-popup__cover {
  height: 100px;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  & + .author-data-popup__content {
    padding: 0 15px 15px;

    & .author-data-popup__avatar {
      margin-top: -50px;
    }
  }
}

.author-data-popup__avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
  border: 5px solid var(--dropdown-bg-color);
  background: var(--dropdown-bg-color);
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
}

.author-data-popup__name {
  margin-top: 10px;
  max-width: 285px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 20px;
  font-weight: 700;
}

.author-data-popup__description {
  margin-top: 10px;
  line-height: 22px;
  white-space: normal;
  word-break: break-word;
}
</style>