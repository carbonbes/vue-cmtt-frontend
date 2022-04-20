<template>
  <div class="profile__comments">
    <profile-comment
      v-for="comment in commentsList"
      :comment="comment"
      :key="comment.id"
    />
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
  & .profile__comment {
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}
</style>