<template>
  <div class="profile-popup">
    <div
      class="profile-popup__img-cover profile-popup__cover"
      :style="imgCover"
      v-if="isImgCover"
    />
    <video
      class="profile-popup__video-cover profile-popup__cover"
      :src="`https://leonardo.osnova.io/${this.data.cover.data.uuid}/-/format/mp4/`"
      autoPlay
      playsInline
      loop
      muted
      v-if="isGifCover"
    />
    <div class="profile-popup__content">
      <div class="profile-popup__actions">
        <div class="profile-popup__avatar" :style="avatar" />
        <div class="profile-popup__subscribe-btn">
          <button
            class="button button_a"
            @mouseenter="toggleButtonFocus"
            @mouseleave="toggleButtonFocus"
          >
            <user-add-icon class="icon" v-if="!isSubscribed" />
            <check-icon
              class="icon icon_subscribed"
              v-if="isSubscribed && !buttonFocus"
            />
            <close-icon
              class="icon icon_unsubscribed"
              v-if="isSubscribed && buttonFocus"
            />
          </button>
        </div>
      </div>
      <div class="profile-popup__author-data">
        <div class="profile-popup__name">
          {{ name }}
        </div>
        <div
          class="profile-popup__description"
          v-if="description"
          v-html="description"
        ></div>
      </div>
      <div class="profile-popup__info">
        <div
          class="profile-popup__author-rating"
          :class="ratingClassObject"
          v-if="isNotSubsite"
        >
          <template v-if="isPositiveRating">+</template>{{ rating }}
        </div>
        <!-- <div
          class="profile-popup__author-rating-loader"
          v-if="(!rating || rating === 0) && isNotSubsite"
        /> -->
        <div class="profile-popup__subs-count" v-if="subsCount">
          {{ subsCount }}
          <span class="profile-popup__subs-label">{{ subsLabel }}</span>
        </div>
        <!-- <div class="profile-popup__subs-loader" v-if="!subsCount" /> -->
        <div class="profile-popup__date-created" v-if="isNotSubsite">
          <span class="label"
            ><template v-if="isNotSubsite">Дата регистрации: </template></span
          >{{ dateCreated }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import declensionWords from "@/utils/declensionWords";
import numberWithSpaces from "@/utils/numberWithSpaces";
import UserAddIcon from "@/assets/logos/user_add.svg?inline";
import CheckIcon from "@/assets/logos/check_icon.svg?inline";
import CloseIcon from "@/assets/logos/close_icon.svg?inline";

export default {
  components: { UserAddIcon, CheckIcon, CloseIcon },

  props: {
    data: Object,
    isSubscribed: Boolean,
  },

  data() {
    return {
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
      buttonFocus: false,
    };
  },

  beforeUnmount() {
    this.clearSubsiteData();
  },

  methods: {
    toggleButtonFocus() {
      this.buttonFocus = !this.buttonFocus;
    },

    ...mapMutations(["clearSubsiteData"]),
  },

  computed: {
    isImgCover() {
      return this.data.cover && this.data.cover.data.type === "jpg";
    },

    isGifCover() {
      return this.data.cover && this.data.cover.data.type === "gif";
    },

    imgCover() {
      if (this.data.cover.data.uuid && this.data.cover.data.type === "jpg") {
        return {
          backgroundImage: `url(https://leonardo.osnova.io/${this.data.cover.data.uuid}/-/scale_crop/720/-/format/webp/)`,
        };
      }
    },

    isNotSubsite() {
      return this.data.type === 1;
    },

    avatar() {
      return {
        backgroundImage: `url(https://leonardo.osnova.io/${this.data.avatar.data.uuid}/-/scale_crop/1920/-/format/webp/)`,
      };
    },

    name() {
      return this.data.name;
    },

    description() {
      return this.data.description.replace(
        /(https?.*?(?=\s|,))/g,
        '<a href="$1" target="_blank">$1</a>'
      );
    },

    subsCount() {
      if (this.subsiteData.counters) {
        return numberWithSpaces(this.subsiteData.counters.subscribers);
      }
    },

    subsLabel() {
      return declensionWords(
        this.subsiteData.counters?.subscribers,
        this.subsWords
      );
    },

    rating() {
      if (this.subsiteData.rating) {
        return numberWithSpaces(this.subsiteData.rating);
      }
    },

    isPositiveRating() {
      return this.subsiteData.rating > 0;
    },

    isNeutralRating() {
      return this.subsiteData.rating === 0;
    },

    isNegativeRating() {
      return this.subsiteData.rating < 0;
    },

    ratingClassObject() {
      return {
        "profile-popup__author-rating_positive": this.isPositiveRating,
        "profile-popup__author-rating_neutral": this.isNeutralRating,
        "profile-popup__author-rating_negative": this.isNegativeRating,
      };
    },

    dateCreated() {
      let dateCreatedFormatted = new Date(this.subsiteData.created * 1000);

      let day = dateCreatedFormatted.getDate();
      let month = dateCreatedFormatted.getMonth();
      let year = dateCreatedFormatted.getFullYear();

      return `${day} ${this.months[month]} ${year} г.`;
    },

    ...mapGetters(["subsiteData"]),
  },
};
</script>

<style lang="scss">
.profile-popup {
  width: 100%;
  height: 100%;
  background: var(--dropdown-bg-color);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 7%), 0 4px 8px 0 rgb(0 0 0 / 7%);
  border-radius: 8px;
  overflow: hidden;

  &__content {
    padding: 15px;
  }

  &__cover {
    & + .profile-popup__content {
      & .profile-popup__avatar {
        margin-top: -70px;
      }
    }
  }

  &__img-cover {
    height: 100px;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }

  &__video-cover {
    width: 100%;
    height: 100px;
    display: block;
    object-fit: cover;
    object-position: 50%;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &__avatar {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
    border: 5px solid var(--dropdown-bg-color);
    box-sizing: initial;
    background: var(--dropdown-bg-color);
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }

  &__author-data {
    margin-top: 10px;
  }

  &__name {
    color: var(--black-color);
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 18px;
    font-weight: 700;
  }

  &__author-rating {
    font-size: 14px;
    line-height: 14px;
    font-weight: 700;

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

  &__author-rating-loader {
    width: 55px;
    height: 14px;
    background: var(--loader-grey-color);
    border-radius: 2px;
  }

  &__actions {
    display: flex;
  }

  &__subscribe-btn {
    margin-left: auto;

    & .button {
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;

      & .icon {
        width: 18px;
        height: 18px;

        &_subscribed {
          color: var(--green-color);
        }

        &_unsubscribed {
          color: var(--red-color);
        }
      }
    }
  }

  &__description {
    margin-top: 5px;
    color: var(--grey-color);
    font-size: 16px;
    line-height: 22px;
    white-space: normal;
    word-break: break-word;

    & + .profile-popup__author-rating {
      margin-top: 20px;
    }
  }

  &__info {
    margin-top: 15px;

    & > div {
      &:not(:first-child) {
        margin-top: 10px;
      }
    }
  }

  &__subs-count {
    color: var(--black-color);
    font-size: 14px;
    font-weight: 700;
    line-height: 15px;
  }

  &__subs-label {
    font-weight: normal;
    color: var(--grey-color);
  }

  &__subs-loader {
    width: 125px;
    height: 15px;
    background: var(--loader-grey-color);
    border-radius: 2px;
  }

  &__date-created {
    font-size: 14px;
    color: var(--grey-color);

    & .label {
      color: var(--black-color);
      font-weight: 700;
    }
  }
}
</style>