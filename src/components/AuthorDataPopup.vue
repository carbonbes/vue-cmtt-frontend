<template>
  <div class="author-data-popup">
    <div
      class="author-data-popup__img-cover author-data-popup__cover"
      :style="imgCover"
      v-if="isImgCover"
    />
    <video
      class="author-data-popup__video-cover author-data-popup__cover"
      :src="`https://leonardo.osnova.io/${this.data.cover.data.uuid}/-/format/mp4/`"
      autoPlay
      playsInline
      loop
      muted
      v-if="isGifCover"
    ></video>
    <div class="author-data-popup__content">
      <div class="author-data-popup__actions">
        <div class="author-data-popup__avatar" :style="avatar" />
        <div class="author-data-popup__subscribe-btn">
          <button class="button button_b">
            <span class="button__label" v-if="!isSubscribed">Подписаться</span>
            <span class="button__label" v-if="isSubscribed">Отписаться</span>
          </button>
        </div>
      </div>
      <div class="author-data-popup__author-data">
        <span class="author-data-popup__name">
          {{ name }}
        </span>
        <span
          class="author-data-popup_author-rating"
          :class="ratingClassObject"
          v-if="isNotSubsite"
          ><template v-if="isPositiveRating">+</template> {{ rating }}</span
        >
      </div>
      <div class="author-data-popup__description" v-if="description">
        {{ description }}
      </div>
      <div class="author-data-popup__subs-count" v-if="subsCount">
        {{ subsCount }}
        <span class="author-data-popup__subs-label">{{ subsLabel }}</span>
      </div>
      <div class="author-data-popup__subs-loader" v-if="!subsCount" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import declensionWords from "@/utils/declensionWords";
import numberWithSpaces from "@/utils/numberWithSpaces";

export default {
  props: {
    data: Object,
    isSubscribed: Boolean,
  },

  data() {
    return {
      subsWords: ["подписчик", "подписчика", "подписчиков"],
    };
  },

  mounted() {
    this.requestSubsiteData(this.data.id);
  },

  unmounted() {
    this.clearSubsiteData();
  },

  methods: {
    ...mapMutations(["clearSubsiteData"]),
    ...mapActions(["requestSubsiteData"]),
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
          backgroundImage: `url(https://leonardo.osnova.io/${this.data.cover.data.uuid}/-/scale_crop/1920/-/format/webp/)`,
        };
      }
    },

    isNotSubsite() {
      return this.subsiteData.type === 1;
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
      return this.data.description;
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
        "author-data-popup_author-rating_positive": this.isPositiveRating,
        "author-data-popup_author-rating_neutral": this.isNeutralRating,
        "author-data-popup_author-rating_negative": this.isNegativeRating,
      };
    },

    ...mapGetters(["subsiteData"]),
  },
};
</script>

<style lang="scss">
.author-data-popup {
  width: 100%;
  height: 100%;
  background: var(--dropdown-bg-color);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 7%), 0 4px 8px 0 rgb(0 0 0 / 7%);
  border-radius: 8px;
}

.author-data-popup__content {
  padding: 15px;
}

.author-data-popup__cover {
  & + .author-data-popup__content {
    & .author-data-popup__avatar {
      margin-top: -70px;
    }
  }
}

.author-data-popup__img-cover {
  height: 100px;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.author-data-popup__video-cover {
  width: 100%;
  height: 100px;
  display: block;
  object-fit: cover;
  object-position: 50%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.author-data-popup__avatar {
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

.author-data-popup__author-data {
  margin-top: 15px;
  display: flex;
  align-items: center;
  font-weight: 700;
}

.author-data-popup__name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 20px;
  font-weight: 700;
}

.author-data-popup_author-rating {
  margin-left: 10px;
  font-size: 15px;
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

.author-data-popup__actions {
  display: flex;
}

.author-data-popup__subscribe-btn {
  margin-left: auto;
}

.author-data-popup__description {
  margin-top: 5px;
  color: var(--grey-color);
  line-height: 22px;
  white-space: normal;
  word-break: break-word;
}

.author-data-popup__subs-count {
  margin-top: 15px;
  font-size: 15px;
  font-weight: 700;
  line-height: 15px;
}

.author-data-popup__subs-label {
  font-weight: normal;
  color: var(--grey-color);
}

.author-data-popup__subs-loader {
  margin-top: 15px;
  width: 125px;
  height: 15px;
  background: var(--grey-color);
  border-radius: 2px;
}
</style>