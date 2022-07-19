<template>
  <div class="likes-popup" ref="likesPopupRef">
    <ScrollComponent content-max-height="264px" thumb-width="2px">
      <LikesPopupItem
        v-for="(like, i) in props.likes"
        :key="i"
        :user-id="i"
        :avatar-url="like.avatar_url"
        :user-name="like.user_name || like.name"
        :sign="like.sign"
        :popup-ref="likesPopupRef"
      />
    </ScrollComponent>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LikesPopupItem from "./LikesPopupItem.vue";
import ScrollComponent from "../ScrollComponent.vue";

const likesPopupRef = ref(null);

const props = defineProps(["likes"]);
</script>

<style lang="scss">
.likes-popup {
  padding: 5px;
  width: 215px;
  border-radius: 8px;
  background: var(--dropdown-bg);
  box-shadow: 0 4px 8px rgb(0 0 0 / 6%), 0 0 1px rgb(0 0 0 / 25%);
  overflow-y: scroll;
  scrollbar-width: none;
  overscroll-behavior: none;

  &::-webkit-scrollbar {
    display: none;
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