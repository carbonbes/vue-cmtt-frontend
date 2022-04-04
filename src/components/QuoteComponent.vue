<template>
  <blockquote class="quote-component">
    <div class="quote-component__content">
      <quoute-icon class="icon" />
      <div class="text" :class="textSize">
        <template v-for="(p, i) in processedText" :key="i">
          <p v-html="p"></p>
        </template>
      </div>
      <div class="author" v-if="avatarSrc || author || bio">
        <div class="avatar" :style="avatar" v-if="avatarSrc" />
        <div class="data">
          <span class="name" v-html="author"></span>
          <span class="description" v-text="bio" v-if="bio"></span>
        </div>
      </div>
    </div>
  </blockquote>
</template>

<script>
import QuouteIcon from "@/assets/logos/quote_icon.svg?inline";

export default {
  components: {
    QuouteIcon,
  },

  props: {
    avatarSrc: String,
    authorSrc: String,
    bio: String,
    text: String,
    textSizeSrc: String,
  },

  computed: {
    avatar() {
      if (this.avatarSrc) {
        return {
          "background-image": `url(
          https://leonardo.osnova.io/${this.avatarSrc}/-/scale_crop/108x108/-/format/webp/
        )`,
        };
      }
    },

    author() {
      return this.authorSrc.replace(
        /(\[(.*?)\])\((https?\:\/\/.*?)\)/g,
        '<a href="$3" target="_blank">$2</a>'
      );
    },

    processedText() {
      return this.text.split("\n\n").map((item) =>
        item
          .replace(/\\/g, "")
          .replace(/^\*[^\s](.+)[^\s](?:\*)/gm, "<i>$1</i>")
          .replace(
            /(\[(.*?)\])\((https?\:\/\/.*?)\)/g,
            '<a href="$3" target="_blank">$2</a>'
          )
      );
    },

    textSize() {
      return {
        text_small: this.textSizeSrc === "small",
        text_medium: this.textSizeSrc === "medium",
      };
    },
  },
};
</script>

<style lang="scss">
.quote-component {
  --quote-padding: 45px 0 35px 25px;
  --font-size-small: 22px;
  --line-height-small: 32px;

  padding: var(--quote-padding);
  background-color: var(--highlight-block-color);

  &__content {
    position: relative;
    margin: 0 auto;
    max-width: 450px;

    & .icon {
      position: absolute;
      top: 0.25em;
      left: -57px;
    }

    & .text {
      &_small {
        font-size: var(--font-size-small);
        font-weight: 400;
        line-height: var(--line-height-small);
      }

      &_medium {
        font-size: 24px;
        font-weight: 500;
        line-height: 34px;
      }

      & p {
        margin-top: 0.5em;
        margin-bottom: 0.5em;

        &:first-child {
          margin-top: 0;
          margin-bottom: 0.5em;
        }

        &:last-child {
          margin-top: 0.5em;
          margin-bottom: 0;
        }
      }
    }

    & .author {
      margin-top: 20px;
      display: flex;
      align-items: center;

      & .avatar {
        margin-right: 15px;
        width: 48px;
        height: 48px;
        min-width: 48px;
        min-height: 48px;
        align-self: flex-start;
        background-size: cover;
        border-radius: 50%;
      }

      & .data {
        display: flex;
        flex-direction: column;

        & .name {
          font-size: 17px;
          font-weight: 600;
          line-height: 1.35em;
        }

        & .description {
          font-size: 16px;
          line-height: 1.35em;
        }
      }
    }

    & p {
      margin: 0;
    }
  }
}

@media screen and (max-width: 768px) {
  .quote-component {
    --quote-padding: 15px 25px 15px 50px;
    --font-size-small: 18px;
    --line-height-small: 1.6em;

    &__content {
      & .icon {
        width: 21px;
        height: auto;
        left: -35px;
      }
    }
  }
}
</style>