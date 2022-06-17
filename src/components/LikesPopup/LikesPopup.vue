<template>
  <div class="likes-popup" ref="likesPopupRef">
    <template v-for="(like, index) in this.likes" :key="index">
      <template v-if="this.type === 'entry'">
        <LikesPopupItem
          :userId="index"
          :avatarUrl="like.avatar_url"
          :userName="like.user_name"
          :sign="like.sign"
          :popupRef="this.$refs.likesPopupRef"
        />
      </template>

      <template v-if="this.type === 'comment'">
        <LikesPopupItem
          :userId="index"
          :avatarUrl="like.avatar_url"
          :userName="like.name"
          :sign="like.sign"
          :popupRef="this.$refs.likesPopupRef"
        />
      </template>
    </template>
  </div>
</template>

<script>
import LikesPopupItem from "./LikesPopupItem.vue";

export default {
  props: {
    likes: Object,
    type: String,
  },

  components: { LikesPopupItem },
};
</script>

<style lang="scss">
.likes-popup {
  padding: 5px;
  width: 215px;
  max-height: 264px;
  border-radius: 8px;
  background: var(--dropdown-bg);
  box-shadow: 0 4px 8px rgb(0 0 0 / 6%), 0 0 1px rgb(0 0 0 / 25%);
  overflow-y: scroll;
  scrollbar-width: none;
  overscroll-behavior: none;

  &::-webkit-scrollbar {
    width: 0;
  }

  &__item {
    padding: 7.5px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    color: var(--black-color);

    &:not(:last-child) {
      margin-bottom: 2.5px;
    }

    .item-avatar {
      min-width: 22.5px;
      min-height: 22.5px;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: cover;
      box-shadow: inset 0 0 0 1px var(--box-shadow-avatar);
      border-radius: 6px;
    }

    .item-nickname {
      margin-left: 7.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &_positive {
        color: var(--green-color);
      }

      &_negative {
        color: var(--red-color);
      }
    }
  }
}

@media (hover: hover) {
  .likes-popup__item {
    &:hover {
      background: var(--dropdown-item-hover-bg);
    }
  }
}
</style>