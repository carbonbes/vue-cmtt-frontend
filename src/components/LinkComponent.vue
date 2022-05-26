<template>
  <a class="link-block" :href="urlSrc" target="_blank">
    <div class="link-block__content">
      <span class="link-block__title">{{ title }}</span>
      <span class="link-block__description">{{ description }}</span>
      <div class="link-block__url">
        <link-icon class="icon" />{{ shortUrl[1] }}
      </div>
    </div>
    <div class="link-block__logo" v-if="sourceLogo">
      <img :src="sourceLogo" />
    </div>
  </a>
</template>

<script>
import LinkIcon from "@/assets/logos/link_icon.svg?inline";

export default {
  props: {
    title: String,
    description: String,
    urlSrc: String,
    sourceIcon: String,
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

<style lang="scss">
.link-block {
  position: relative;
  padding: 11px 16px;
  display: flex;
  flex-flow: row;
  background: var(--link-block-bg-color);
  border: 1px solid var(--embed-border-color);
  border-radius: 6px;
  z-index: 1;
}

.link-block__title {
  margin-bottom: 2px;
  font-size: 18px;
  font-weight: 500;
}

.link-block__description {
  font-size: 15px;
  line-height: 22px;
}

.link-block__title,
.link-block__description {
  display: block;
  line-height: 26px;
  white-space: nowrap;
  max-width: 472px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-block__logo {
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;

  & img {
    width: 64px;
    height: 64px;
    border-radius: 2px;
  }
}

.link-block__url {
  margin-top: 15px;
  display: flex;
  font-size: 13px;
  line-height: 16px;
  color: var(--grey-color);

  & .icon {
    margin-right: 7px;
    width: 16px;
    height: 16px;
  }
}

@media screen and (max-width: 768px) {
  .link-block__title,
  .link-block__description {
    max-width: 175px;
  }
}
</style>