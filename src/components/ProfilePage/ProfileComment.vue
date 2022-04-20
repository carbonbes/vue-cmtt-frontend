<template>
  <div class="profile__comment">
    <div class="comment-header" v-if="entryTitle">
      <router-link
        class="entry-title"
        :to="{ name: 'EntryPage', params: { id: entryId } }"
        v-text="entryTitle"
      ></router-link>
    </div>
    <div class="comment-content">
      <div class="comment-author">
        <div class="comment-author__avatar" :style="authorAvatarStyleObj"></div>
        <div class="comment-author__name" v-text="authorName"></div>
      </div>
      <router-link
        class="comment-date"
        :to="{
          name: 'EntryPage',
          params: { id: entryId },
          query: { comment: commentId },
        }"
        ><DateTime :date="commentDateCreated" type="0"
      /></router-link>
      <div class="comment-text" v-text="commentText" v-if="commentText"></div>
    </div>
    <div class="comment-footer">
      <router-link
        class="reply-btn"
        :to="{
          name: 'EntryPage',
          params: { id: entryId },
          query: { comment: commentId, mode: 'reply' },
        }"
        >Ответить</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import DateTime from "@/components/DateTime.vue";

const props = defineProps({
  comment: Object,
});

const entryId = computed(() => props.comment.entry.id);

const commentId = computed(() => props.comment.id);

const entryTitle = computed(() => props.comment.entry.title);

const authorId = computed(() => props.comment.author.id);

const authorAvatarStyleObj = computed(() => ({
  "background-image": `url(https://leonardo.osnova.io/${props.comment.author.avatar.data.uuid}/-/scale_crop/64x64/-/format/webp/)`,
}));

const authorName = computed(() => props.comment.author.name);

const commentDateCreated = computed(() => {
  return props.comment.date * 1000;
});

const commentText = computed(() => props.comment.text);
</script>

<style lang="scss">
.profile__comment {
  padding: 15px 20px;
  background: var(--entry-bg-color);
  border-radius: 8px;

  & .comment-header {
    margin-bottom: 15px;

    & .entry-title {
      font-size: 15px;
      line-height: 22px;
      font-weight: 700;
    }
  }

  & .comment-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    & .comment-author {
      display: flex;
      align-items: center;

      &__avatar {
        margin-right: 7px;
        width: 20px;
        height: 20px;
        background-size: cover;
        background-repeat: no-repeat;
        border-radius: 6px;
        box-shadow: var(--border-a);
      }

      &__name {
        font-size: 14px;
        line-height: 16px;
        font-weight: 500;
      }
    }

    & .comment-date {
      margin-left: 13px;

      & .date-time {
        color: var(--grey-color);
        font-size: 13px;
        line-height: 20px;
      }
    }

    & .comment-text {
      padding: 10px 0;
      font-size: 15px;
      line-height: 22px;
      word-break: break-word;
      overflow: hidden;
      flex-basis: 100%;
    }
  }

  & .comment-footer {
    & .reply-btn {
      color: var(--grey-color);
      font-size: 15px;
    }
  }
}

@media (hover: hover) {
  .profile__comment {
    & .comment-header {
      & .entry-title {
        &:hover {
          color: var(--blue-color);
        }
      }
    }

    & .comment-content {
      & .comment-date {
        & .date-time {
          &:hover {
            color: var(--blue-color);
          }
        }
      }
    }

    & .comment-footer {
      & .reply-btn {
        &:hover {
          color: var(--blue-color);
        }
      }
    }
  }
}

@media screen and (max-width: 641px) {
  .profile__comment {
    border-radius: 0;
  }
}
</style>