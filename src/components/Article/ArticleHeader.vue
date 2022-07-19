<script setup>
import { computed } from "vue";
import DateTime from "../DateTime.vue";
import PinIcon from "@/assets/logos/pin_icon.svg?inline";

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
const isPinned = computed(() => props.article.isPinned);
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
    <div class="details">
      <router-link
        :to="{ path: `/u/${authorId}` }"
        class="author-name"
        v-text="authorName"
        v-if="!isSameAuthor"
      ></router-link>
      <div class="date-created">
        <router-link :to="{ path: '/' + articleId }">
          <DateTime
            :date="dateCreated"
            :type="props.dateType"
            :title="dateCreatedTitle"
          />
        </router-link>
      </div>
      <div class="pin-icon" v-if="isPinned" title="Закреплено автором">
        <PinIcon class="icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.article-component__header {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(3, minmax(0, max-content));

  .subsite-avatar {
    margin-right: 10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px var(--box-shadow-avatar);
    background-size: cover;
    background-repeat: no-repeat;
    grid-row: 2 span;
    grid-column: 1 span;
  }

  .subsite-name {
    min-width: 0;
    max-width: max-content;
    flex: 1;
    font-size: 15px;
    line-height: 15px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    grid-row: 1 span;
    grid-column: 2 span;
  }

  .author-name {
    margin-right: 12px;
    min-width: 0;
    max-width: max-content;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    grid-row: 1 span;
  }

  .details {
    display: flex;
    align-self: flex-end;
    font-size: 13px;
    grid-row: 2 span;
    grid-column: 2 span;
    transform: translateY(2px);

    .date-created {
      color: var(--grey-color);
    }

    .pin-icon {
      margin-left: 10px;

      .icon {
        width: 11px;
        color: var(--grey-color);
      }
    }
  }
}

@media (hover: hover) {
  .article-component__header {
    .subsite-name,
    .author-name,
    .details > .date-created {
      &:hover {
        color: var(--blue-color);
      }
    }

    .subsite-avatar {
      &:hover {
        ~ .subsite-name {
          color: var(--blue-color);
        }
      }
    }
  }
}
</style>