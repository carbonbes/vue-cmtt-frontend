<script>
import LinkIcon from "@/assets/logos/link_icon.svg?inline";

export default {
  props: {
    title: String,
    description: String,
    urlSrc: String,
    sourceIcon: String,
    availability: Boolean,
  },

  components: { LinkIcon },

  computed: {
    shortUrl() {
      let regex = /https?\:\/\/(.+?)(?=\/)/gi;
      return regex.exec(this.urlSrc);
    },

    sourceLogo() {
      if (
        this.sourceIcon &&
        /https\:\/\/tjournal\.ru|https\:\/\/proxy.leonardo.osnova.io/g.test(
          this.sourceIcon
        )
      ) {
        return this.sourceIcon;
      } else return `https://leonardo.osnova.io/${this.sourceIcon}/`;
    },
  },
};
</script>

<template>
  <template v-if="this.availability">
    <a class="link-block" :href="urlSrc" target="_blank">
      <div class="content">
        <span class="title">{{ title }}</span>
        <span class="description">{{ description }}</span>
        <div class="url"><LinkIcon class="icon" />{{ shortUrl[1] }}</div>
      </div>
      <div class="logo" v-if="sourceLogo">
        <img :src="sourceLogo" />
      </div>
    </a>
  </template>

  <template v-if="!this.availability">
    <div class="link-block link-block_unavailable">
      <div class="link-block__content">
        <span class="title">Ссылка недоступна</span>
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.link-block {
  position: relative;
  padding: 11px 16px;
  display: flex;
  flex-flow: row;
  border: 1px solid var(--embed-border-color);
  border-radius: 6px;
  z-index: 1;

  &_unavailable {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--grey-color);

    .link-block__content {
      .title {
        font-size: 16px;
      }
    }
  }
}

.title {
  margin-bottom: 2px;
  font-size: 18px;
  font-weight: 500;
}

.description {
  font-size: 15px;
  line-height: 22px;
}

.title,
.description {
  display: block;
  line-height: 26px;
  white-space: nowrap;
  max-width: 472px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logo {
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;

  img {
    width: 64px;
    height: 64px;
    border-radius: 2px;
  }
}

.url {
  margin-top: 15px;
  display: flex;
  font-size: 13px;
  line-height: 16px;
  color: var(--grey-color);

  .icon {
    margin-right: 7px;
    width: 16px;
    height: 16px;
  }
}

@media screen and (max-width: 768px) {
  .title,
  .description {
    max-width: 175px;
  }
}
</style>
