<template>
  <div class="profile__comments" v-if="commentsList.length">
    <profile-comment
      v-for="comment in commentsList"
      :comment="comment"
      :key="comment.id"
    />
  </div>

  <div class="profile__comments_empty" v-if="!commentsList.length">
    <span>Пользователь не оставил ни одного комментария</span>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import rootStore from "@/store";
import nProgress from "nprogress";
import ProfileComment from "@/components/ProfilePage/ProfileComment.vue";

export default {
  setup() {
    const store = useStore();

    const commentsList = computed(() => store.getters.profileComments);

    return { commentsList };
  },

  components: { ProfileComment },

  beforeUnmount() {
    rootStore.commit("clearProfileComments");
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    nProgress.start();

    return rootStore
      .dispatch("requestProfileComments", {
        subsiteId: routeTo.params.id,
      })
      .then(() => {
        nProgress.done();
        next();
      });
  },
};
</script>

<style lang="scss">
.profile__comments {
  &_empty {
    padding: 88px 0;
    background: var(--entry-bg-color);
    border-radius: 8px;
    color: var(--grey-color);
    text-align: center;
  }

  & .profile__comment {
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}

@media screen and (max-width: 641px) {
  .profile__comments_empty {
    border-radius: 0;
  }
}
</style>