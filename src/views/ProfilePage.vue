<template>
  <div class="pp__wrapp">
    <div class="pp-content">
      <div class="content-subsite">
        <div class="subsite">
          <div
            class="subsite__cover"
            :style="coverStyleObj"
            v-if="coverStyleObj"
          ></div>
          <div class="subsite__avatar" :style="subsiteAvatar"></div>
          <div class="subsite__name" v-text="subsiteName"></div>
          <div
            class="subsite__description"
            v-text="subsiteDescription"
            v-if="subsiteDescription"
          ></div>
          <div class="subsite__stats">
            <div class="subsite__stat">
              <div
                class="rating"
                :class="subsiteRatingClassObj"
                v-text="subsiteRating"
              ></div>
              <div class="subs-count" v-text="subsiteSubs"></div>
            </div>
            <div class="subsite__stat">
              На проекте с {{ subsiteDateCreated }}
            </div>
          </div>
          <div class="subsite__tabs">
            <div class="tabs">
              <div class="tabs__scroll">
                <div class="tabs__content">
                  <router-link
                    class="tab"
                    active-class="tab_active"
                    :to="append($route.path, 'entries')"
                  >
                    <span class="tab__label">Статьи</span>
                  </router-link>
                  <router-link
                    class="tab"
                    active-class="tab_active"
                    :to="append($route.path, 'comments')"
                  >
                    <span class="tab__label">Комментарии</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-content"><router-view></router-view></div>
      <div class="content-sidebar"></div>
    </div>
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import rootStore from "@/store";
import nProgress from "nprogress";
import declensionWords from "@/utils/declensionWords";
import numberWithSpaces from "@/utils/numberWithSpaces";
import { notify } from "@kyvg/vue3-notification";

function requestProfile(routeTo, next) {
  nProgress.start();

  Promise.all([
    rootStore.dispatch("requestProfile", {
      id: routeTo.params.id,
    }),
    rootStore.dispatch("requestProfileEntries", {
      subsiteId: routeTo.params.id,
    }),
  ])
    .then(() => {
      nProgress.done();
      next();
    })
    .catch((error) => {
      nProgress.done();
      next(false);
      rootStore.commit("setProfileHidden", true);
      rootStore.commit("clearProfileEntries");
      notify({
        title: "Ошибка " + error.response.data.error.code,
        type: "error",
        text: error.response.data.message,
      });
    });
}

export default {
  setup() {
    const store = useStore();

    const state = reactive({
      subsWords: ["подписчик", "подписчика", "подписчиков"],
      months: [
        "янв",
        "фев",
        "мар",
        "апр",
        "мая",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ],
    });

    const profile = computed(() => store.getters.profile);

    const coverStyleObj = computed(() => {
      if (profile.value.cover) {
        return {
          "background-image": `url(https://leonardo.osnova.io/${profile.value.cover.data.uuid}/-/scale_crop/1920/-/format/webp/)`,
        };
      }
    });

    const subsiteAvatar = computed(() => ({
      "background-image": `url(https://leonardo.osnova.io/${profile.value.avatar.data.uuid}/-/scale_crop/300x300/-/format/webp/)`,
    }));

    const subsiteName = computed(() => {
      return profile.value.name;
    });

    const subsiteDescription = computed(() => {
      return profile.value.description;
    });

    const subsiteRating = computed(() => {
      if (profile.value.rating) {
        if (profile.value.rating > 0) {
          return "+" + numberWithSpaces(profile.value.rating);
        } else if (profile.value.rating === 0) {
          return numberWithSpaces(profile.value.rating);
        } else if (profile.value.rating < 0) {
          let subsiteRatingFormatted = profile.value.rating
            .toString()
            .replace(/\-/g, "");

          return "−" + numberWithSpaces(subsiteRatingFormatted);
        }
      }
    });

    const subsiteRatingClassObj = computed(() => ({
      rating_positive: profile.value.rating > 0,
      rating_neutral: profile.value.rating === 0,
      rating_negative: profile.value.rating < 0,
    }));

    const subsiteSubs = computed(() => {
      if (profile.value.counters.subscribers) {
        let subsiteSubsWithSpaces = numberWithSpaces(
          profile.value.counters.subscribers
        );

        let subsiteSubsWordDecl = declensionWords(
          profile.value.counters.subscribers,
          state.subsWords
        );

        return subsiteSubsWithSpaces + " " + subsiteSubsWordDecl;
      }
    });

    const subsiteDateCreated = computed(() => {
      let dateCreatedFormatted = new Date(profile.value.created * 1000);

      let day = dateCreatedFormatted.getDate();
      let month = dateCreatedFormatted.getMonth();
      let year = dateCreatedFormatted.getFullYear();

      return `${day} ${state.months[month]} ${year}`;
    });

    return {
      coverStyleObj,
      subsiteAvatar,
      subsiteName,
      subsiteDescription,
      subsiteRating,
      subsiteRatingClassObj,
      subsiteSubs,
      subsiteDateCreated,
    };
  },

  mounted() {
    document.title = this.subsiteName + " — Блог на TJ ";
  },

  unmounted() {
    rootStore.commit("clearProfileEntries");
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    requestProfile(routeTo, next);
  },

  beforeRouteUpdate(routeTo, routeFrom, next) {
    requestProfile(routeTo, next);
  },
};
</script>

<style lang="scss">
.pp__wrapp {
  --grid-gap: 32px 20px;
  --offset-x: 20px;
  --offset-y: 24px;
  --subsite-brad: 0 0 8px 8px;
  --subsite-cover-height: 280px;
  --subsite-avatar-border-width: 4px;
  --avatar-size: 112px;
  --name-fs: 36px;
  --font-size: 17px;
  --height: 63px;
  --nav-size: 36px;
  --tab-offset: 10px;

  max-width: 960px;
  margin: 0 auto;

  & .pp-content {
    display: grid;
    grid-gap: var(--grid-gap);

    & .content-subsite {
      grid-column: span 2;

      & .subsite {
        padding: var(--offset-y) var(--offset-x);
        display: grid;
        font-size: 16px;
        line-height: 1.5em;
        color: var(--black-color);
        background: var(--entry-bg-color);
        border-radius: var(--subsite-brad);

        &__cover {
          margin-top: calc(var(--offset-y) * -1);
          margin-left: calc(var(--offset-x) * -1);
          margin-right: calc(var(--offset-x) * -1);
          height: var(--subsite-cover-height);
          background-color: #dedede;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: 50% 50%;

          &::before {
            content: "";
            display: block;
            padding-top: 32.8125%;
          }

          & + .subsite__avatar {
            margin-top: -88px;
          }
        }

        &__avatar {
          width: var(--avatar-size);
          height: var(--avatar-size);
          background-color: #dedede;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: 50% 0%;
          border-radius: 6px;
          box-shadow: 0 0 0 var(--subsite-avatar-border-width)
              var(--entry-bg-color),
            inset var(--border-a);
        }

        &__name {
          margin-top: 8px;
          font-size: var(--name-fs);
          line-height: 1.46em;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          grid-column: 1;
        }

        &__description {
          margin-top: 4px;
          grid-column-start: span 2;

          & ~ .subsite__stats {
            margin-top: 20px;
          }
        }

        &__stats {
          margin-top: 8px;
          display: flex;
          flex-direction: column;

          & .subsite__stat {
            display: flex;

            &:not(:last-child) {
              margin-bottom: 8px;
            }
          }

          & .rating {
            margin-right: 16px;
            font-weight: 500;

            &_positive {
              color: var(--green-color);
            }

            &_neutral {
              color: var(--grey-color);
            }

            &_negative {
              color: var(--red-color);
            }
          }
        }

        &__tabs {
          margin-bottom: calc(var(--offset-y) * -1);
          margin-left: calc(var(--offset-x) * -1);
          margin-right: calc(var(--offset-x) * -1);
        }

        & .tabs {
          position: relative;
          min-width: 0;
          height: var(--height);
          font-size: var(--font-size);
        }

        & .tabs__scroll {
          white-space: nowrap;
          overflow-x: hidden;
          overflow-y: hidden;
        }

        & .tabs__content {
          padding-left: var(--offset-x);
          padding-right: var(--offset-x);
          display: inline-flex;
          vertical-align: top;

          & .tab {
            padding: 0 var(--tab-offset);
            flex-shrink: 0;
            font-weight: 500;
            color: var(--grey-color);
            cursor: pointer;

            &_active {
              color: var(--black-color);
              pointer-events: none;

              & .tab__label {
                position: relative;

                &::after {
                  content: "";
                  width: 100%;
                  height: 3px;
                  background-color: var(--blue-color);
                  position: absolute;
                  bottom: 0;
                  left: 0;
                }
              }
            }

            &:first-child {
              padding-left: 0;
            }

            &__label {
              display: flex;
              align-items: baseline;
              height: var(--height);
              line-height: calc(var(--height) + 1px);
            }
          }
        }

        &__cover,
        &__avatar,
        &__stats,
        &__tabs {
          min-width: 0;
          grid-column-start: span 2;
        }
      }
    }

    & .content-content {
      grid-column: 1;
    }
  }
}

@media screen and (max-width: 641px) {
  .pp__wrapp {
    --subsite-brad: 0;
  }
}

@media screen and (max-width: 999px) {
  .pp__wrapp {
    --grid-gap: 20px 0;
    --offset-x: 16px;
    --offset-y: 16px;
    --avatar-size: 72px;
    --name-fs: 24px;
    --subsite-cover-height: auto;
    --subsite-avatar-border-width: 2px;

    width: 100%;
    max-width: 640px;
    margin: 0 auto;

    & .pp-content {
      & .content-subsite {
        & .subsite {
          &__cover {
            & + .subsite__avatar {
              margin-top: -52px;
            }
          }

          & .subsite__stats {
            margin-top: 17px;
            font-size: 14px;
            line-height: 1.43em;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 1000px) {
  .pp__wrapp {
    & .pp-content {
      grid-template-columns: 1fr 300px;
    }
  }
}
</style>