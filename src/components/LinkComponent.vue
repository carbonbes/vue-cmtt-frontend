<template>
  <a
    class="link-block"
    :href="url"
    target="_blank
"
  >
    <div class="link-block__content">
      <span class="link-block__title">{{ title }}</span>
      <span class="link-block__description">{{ description }}</span>
      <div class="link-block__link"><link-icon />{{ url[1] }}</div>
    </div>
    <div class="link-block__logo">
      <!-- <img :src="`https://leonardo.osnova.io/${sourceIcon}/`" /> -->
      <img :src="`${sourceIcon}`" />
    </div>
  </a>
</template>

<script>
import LinkIcon from "@/assets/logos/link_icon.svg?inline";

export default {
  props: {
    data: Object,
  },

  components: { LinkIcon },

  computed: {
    title() {
      return this.data[0].data.link.data.title;
    },

    description() {
      return this.data[0].data.link.data.description;
    },

    url() {
      let regex = /https?\:\/\/(.+?)(?=\/)/gi;
      let srcUrl = this.data[0].data.link.data.url;
      return regex.exec(srcUrl);
    },

    sourceIcon() {
      return this.data[0].data.link.data.image.data.uuid;
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
  border-radius: 4px;
  z-index: 1;
}

.link-block__title {
  margin-bottom: 2px;
  font-size: 18px;
  font-weight: 500;
}

.link-block__description {
  margin-bottom: 5px;
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

.link-block__link {
  font-size: 12px;
  line-height: 17px;
  color: var(--grey-color);
  text-transform: uppercase;

  & .icon {
    margin-right: 7px;
    width: 11px;
    height: 11px;
  }
}

@media screen and (max-width: 768px) {
  .link-block__title,
  .link-block__description {
    max-width: 230px;
  }
}
</style>