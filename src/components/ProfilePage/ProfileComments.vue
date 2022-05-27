<template>
  <div class="profile__comments" v-if="commentsList.length">
    <template v-for="(comment, index) in commentsList" :key="comment.id">
      <profile-comment
        :comment="comment"
        v-if="commentsList.length !== index + 1"
      />

      <profile-comment
        :comment="comment"
        v-intersect="{
          type: 'when-appears',
          threshold: 0,
          callback: requestNextPage,
        }"
        v-else
      />
    </template>

    <div class="comments-loader" v-if="this.currentPage < this.totalPages">
      <loader />
    </div>
  </div>

  <div class="profile__comments_empty" v-if="!commentsList.length">
    <span>Пользователь не оставил ни одного комментария</span>
  </div>
</template>

<script>
import { computed, ref, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ProfileComment from "@/components/ProfilePage/ProfileComment.vue";
import Loader from "@/components/Loader.vue";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();

    // state
    const currentPage = ref(1);

    // computed
    const commentsList = computed(() => store.getters.profileComments);

    const commentsListLastId = computed(
      () => store.getters.profileCommentsLastId
    );

    const commentsLastSortingValue = computed(
      () => store.getters.profileCommentsLastSortingValue
    );

    const profileCommentsCount = computed(
      () => store.getters.profileECommentsCount
    );

    const totalPages = computed(() => {
      return Math.ceil(profileCommentsCount.value / 30);
    });

    // methods
    const requestNextPage = () => {
      if (currentPage.value < totalPages.value) {
        store.commit("setProfileCommentsIsRequested", true);

        store
          .dispatch("requestProfileComments", {
            params: {
              subsiteId: route.params.id,
              lastId: commentsListLastId.value,
              lastSortingValue: commentsLastSortingValue.value,
            },
          })
          .then(() => {
            currentPage.value += 1;
            store.commit("setProfileCommentsIsRequested", false);
          });
      }
    };

    onUnmounted(() => {
      store.commit("clearProfileComments");
    });

    return {
      currentPage,
      commentsList,
      commentsListLastId,
      commentsLastSortingValue,
      profileCommentsCount,
      totalPages,
      requestNextPage,
    };
  },

  components: { ProfileComment, Loader },
};
</script>

<style lang="scss">
.profile__comments {
  & .comments-loader {
    padding: 20px;
    max-width: 640px;
    background: var(--entry-bg-color);
    color: var(--black-color);
    border-radius: 8px;
    user-select: none;

    & .custom-loader {
      &__loader-1,
      &__loader-2,
      &__loader-3 {
        background-color: var(--black-color);
      }
    }
  }

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