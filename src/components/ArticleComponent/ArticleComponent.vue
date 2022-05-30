<script setup>
import { computed } from "vue";
import ArticleHeader from "./ArticleHeader.vue";
import ArticleContent from "./ArticleContent/ArticleContent.vue";
import ArticleFooter from "./ArticleFooter.vue";

// props
const props = defineProps(["article", "type"]);

// computed
const articleId = computed(() => props.article.id);
const articleTitle = computed(() => props.article.title);
const isEditorial = computed(() => props.article.isEditorial);
const articleContent = computed(() =>
  props.article.blocks.filter((block) => block.cover)
);
const articleCounters = computed(() => props.article.counters);
const articleLikes = computed(() => props.article.likes);
</script>

<template>
  <div class="article-component">
    <ArticleHeader class="e-island" :article="props.article" dateType="0" />
    <ArticleContent
      :articleId="articleId"
      :title="articleTitle"
      :isEditorial="isEditorial"
      :content="articleContent"
    />
    <ArticleFooter
      class="e-island"
      :articleId="articleId"
      :articleCounters="articleCounters"
      :articleLikes="articleLikes"
      :type="props.type"
    />
  </div>
</template>

<style lang="scss">
.article-component {
  --title-padding: 0 20px;
  --vertical-cover-max-width: 55%;
  --b-radius: 8px;
  --e-island-padding: 20px;

  position: relative;
  max-width: 640px;
  display: flex;
  flex-flow: column;
  color: var(--black-color);
  background: var(--entry-bg-color);
  border-radius: var(--b-radius);

  & > &__header {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  &__content {
    position: relative;
    word-break: break-word;
    line-height: 1.6em;

    & .article-title {
      margin-top: -4px;
      padding: var(--title-padding);
      font-size: 22px;
      font-weight: 500;
      line-height: 32px;

      &:nth-last-child(-n + 2) {
        margin-bottom: -5px;
      }

      & .editorial-icon {
        & > .icon {
          margin-left: 5px;
        }
      }
    }

    & .subtitle {
      margin-top: 3px;
      font-size: 17px;

      &:first-child {
        margin-top: -6px;
      }

      &:nth-last-child(-n + 2) {
        margin-bottom: -6px;
      }

      & p {
        & a {
          position: relative;
          z-index: 1;
        }

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    & .media {
      margin-top: 12px;

      &:first-child {
        margin-top: 0;
      }

      &_wide {
        width: 100%;

        & > div {
          margin-left: auto;
          margin-right: auto;
        }
      }

      &_thin {
        padding: 8px 30px;
        background: var(--entry-block-highlight);

        & > div {
          margin: 0 auto;
          max-width: var(--vertical-cover-max-width);
        }
      }
    }

    & .socials-embed {
      margin-top: 12px;

      &:first-child {
        margin-top: 0;
      }

      & > .embed {
        position: relative;
        z-index: 1;
      }
    }

    & .link-embed {
      margin-top: 12px;

      &:first-child {
        margin-top: 0;
      }
    }

    & .link {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  & > &__footer {
    margin-top: 11px;
    margin-bottom: 11px;
  }

  .e-island {
    padding-left: var(--e-island-padding);
    padding-right: var(--e-island-padding);
  }
}

@media (max-width: 640px) {
  .article-component {
    --b-radius: 0;
  }
}

@media (max-width: 768px) {
  .article-component {
    --title-padding: 0 15px;
    --e-island-padding: 15px;
  }
}
</style>