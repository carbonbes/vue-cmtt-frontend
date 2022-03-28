<template>
  <div class="likes-popup">
    <template v-for="(like, index) in this.likes" :key="index">
      <template v-if="this.type === 'entry'">
        <div class="likes-popup__item">
          <div
            class="item-avatar"
            :style="{
              backgroundImage: `url(
                ${like.avatar_url}
              )`,
            }"
          ></div>
          <span
            class="item-nickname"
            :class="{
              'item-nickname_positive': like.sign === 1,
              'item-nickname_negative': like.sign === -1,
            }"
            >{{ like.user_name }}</span
          >
        </div>
      </template>

      <template v-if="this.type === 'comment'">
        <div class="likes-popup__item">
          <div
            class="item-avatar"
            :style="{
              backgroundImage: `url(
                ${like.avatar_url}
              )`,
            }"
          ></div>
          <span
            class="item-nickname"
            :class="{
              'item-nickname_positive': like.sign === 1,
              'item-nickname_negative': like.sign === -1,
            }"
            >{{ like.name }}</span
          >
        </div>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    likes: Object,
    type: String,
  },
};
</script>

<style lang="scss">
.likes-popup {
  padding: 5px;
  width: 215px;
  max-height: 264px;
  border-radius: 8px;
  background: var(--dropdown-bg-color);
  box-shadow: 0 4px 8px rgb(0 0 0 / 6%), 0 0 1px rgb(0 0 0 / 25%);
  overflow-y: scroll;
  scrollbar-width: none;

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

    & .item-avatar {
      min-width: 22.5px;
      min-height: 22.5px;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 6px;
    }

    & .item-nickname {
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
</style>