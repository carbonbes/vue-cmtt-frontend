<script setup>
import { computed } from "vue";
import DateTime from "../DateTime.vue";

// props
const props = defineProps(["article", "dateType"]);

// computed
const articleId = computed(() => props.article.id);
const subsiteId = computed(() => props.article.subsite.id);
const subsiteAvatarSrc = computed(() => props.article.subsite.avatar.data.uuid);
const subsiteAvatar = computed(() => ({
  backgroundImage: `url(https://leonardo.osnova.io/${subsiteAvatarSrc.value}/-/scale_crop/64x64/)`,
}));
const subsiteName = computed(() => props.article.subsite.name);
const authorId = computed(() => props.article.author.id);
const authorName = computed(() => props.article.author.name);
const dateCreated = computed(() => props.article.date * 1000);
const dateCreatedTitle = computed(() =>
  new Date(dateCreated.value).toLocaleString()
);
const isSameAuthor = computed(() => subsiteId.value === authorId.value);
</script>

<template>
  <div class="article-component__header">
    <router-link
      :to="{ path: `/u/${subsiteId}` }"
      class="subsite-avatar"
      :style="subsiteAvatar"
    />
    <router-link
      :to="{ path: `/u/${subsiteId}` }"
      class="subsite-name"
      v-text="subsiteName"
    />
    <router-link
      :to="{ path: `/u/${authorId}` }"
      class="author-name"
      v-text="authorName"
      v-if="!isSameAuthor"
    ></router-link>
    <div class="separator" />
    <div class="details">
      <div class="date-created">
        <router-link :to="{ path: '/' + articleId }">
          <DateTime
            :date="dateCreated"
            :type="props.dateType"
            :title="dateCreatedTitle"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.article-component__header {
  display: flex;
  flex-wrap: wrap;

  & .subsite-avatar {
    margin: 2px 10px -32px 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-shadow: var(--box-shadow-avatar);
    background-size: cover;
    background-repeat: no-repeat;
  }

  & .subsite-name {
    min-width: 0;
    max-width: max-content;
    flex: 1;
    font-size: 15px;
    font-weight: 500;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .author-name {
    margin-left: 12px;
    min-width: 0;
    max-width: max-content;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    line-height: 20px;
    white-space: nowrap;
  }

  & .separator {
    flex-basis: 100%;
  }

  & .details {
    margin-left: 42px;
    display: flex;
    color: var(--grey-color);
    font-size: 12px;
    line-height: 16px;
  }
}

@media (hover: hover) {
  .article-component__header {
    .subsite-name,
    .author-name {
      &:hover {
        color: var(--blue-color);
      }
    }

    .subsite-avatar {
      &:hover {
        & ~ .subsite-name {
          color: var(--blue-color);
        }
      }
    }
  }
}
</style>