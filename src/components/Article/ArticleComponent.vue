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
      :article-id="articleId"
      :title="articleTitle"
      :is-editorial="isEditorial"
      :content="articleContent"
    />
    <ArticleFooter
      class="e-island"
      :article-id="articleId"
      :article-counters="articleCounters"
      :article-likes="articleLikes"
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
  background: var(--island-bg);
  border-radius: var(--b-radius);

  & > &__header {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  &__content {
    position: relative;
    word-break: break-word;
    line-height: 1.7em;

    .article-title {
      margin-top: -3px;
      padding: var(--title-padding);
      font-size: 22px;
      font-weight: 500;
      line-height: 32px;

      &:nth-last-child(-n + 2) {
        margin-bottom: -4px;
      }

      .editorial-icon {
        > .icon {
          margin-left: 5px;
        }
      }
    }

    .subtitle {
      margin-top: 4px;
      font-size: 17px;

      &:first-child {
        margin-top: -3px;
      }

      &:nth-last-child(-n + 2) {
        margin-bottom: -3px;
      }

      p {
        a {
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

    .media {
      margin-top: 12px;
      display: flex;
      justify-content: center;
      background: var(--article-cover-bg);

      &:first-child {
        margin-top: 0;
      }

      > div {
        width: 100%;
      }

      .gallery {
        z-index: 1;
      }
    }

    .socials-embed {
      margin-top: 12px;

      &:first-child {
        margin-top: 0;
      }

      > .embed {
        position: relative;
        z-index: 1;
      }
    }

    .link-embed {
      margin-top: 12px;

      &:first-child {
        margin-top: 0;
      }
    }

    .link {
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