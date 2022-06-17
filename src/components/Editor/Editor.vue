<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import ChevronDownIcon from "@/assets/logos/chevron-down_icon.svg?inline";
import MaximizeIcon from "@/assets/logos/maximize_icon.svg?inline";
import MinimizeIcon from "@/assets/logos/minimize_icon.svg?inline";
import CloseIcon from "@/assets/logos/close_icon.svg?inline";
import Loader from "@/components/Loader.vue";

const store = useStore();
const router = useRouter();

const titleInputRef = ref(null);

// props
const props = defineProps(["isVisible", "closeEditor"]);

// state
const state = reactive({
  title: null,
  text: "",
  subsite_id: null,
  attachments: null,
  uploadedAttachment: null,
  isFullScreen: false,
  createEntryIsRequested: false,
});

// methods
const titleChangeHandler = (e) => {
  e.preventDefault();
  state.title = e.target.innerText.trim();
};

const textChangeHandler = (e) => {
  e.preventDefault();
  state.text = e.target.innerText.trim();
};

const setSubsiteId = (subsiteId) => {
  state.subsite_id = subsiteId;
};

const onPasteTitleHandler = (e) => {
  e.preventDefault();

  if (
    e.clipboardData.files.length > 0 &&
    state.attachments.length !== 1 &&
    !state.uploadedAttachment
  ) {
    state.uploadedAttachment = true;
    store
      .dispatch("uploadFile", e.clipboardData.files[0])
      .then((result) => {
        state.uploadedAttachment = false;
        state.attachments.push(result.data.result[0]);
      })
      .catch(() => {
        state.uploadedAttachment = false;
      });
  } else if (
    e.clipboardData.files.length > 0 &&
    state.attachments.length !== 1 &&
    state.uploadedAttachment
  ) {
    notify({
      type: "error",
      text: "Подождите, пока загрузится текущий файл",
    });
  } else if (
    e.clipboardData.files.length > 0 &&
    state.attachments.length === 1
  ) {
    notify({
      type: "error",
      text: "Максимально можно прикрепить только один файл, удалите существующий и повторите попытку",
    });
  }

  if (e.clipboardData.getData("text/plain").trim().length > 0) {
    let text = e.clipboardData
      .getData("text/plain")
      .replace(/(<([^>]+)>)/gi, "");
    document.execCommand("insertText", false, text);

    state.text.concat(text);
  }
};

const focusTitle = () => {
  titleInputRef.value.focus();
};

const createEntry = () => {
  state.createEntryIsRequested = true;
  store
    .dispatch("createEntry", {
      title: state.title,
      text: state.text,
      subsite_id: state.subsite_id,
      attachments: state.attachments,
    })
    .then((response) => {
      state.createEntryIsRequested = false;
      props.closeEditor();
      router.push({ path: "/" + response.data.result.id });
    })
    .catch((e) => {
      state.createEntryIsRequested = false;
    });
};

const toggleFullScreen = () => {
  state.isFullScreen = !state.isFullScreen;
};

// computed
const componentClassObj = computed(() => ({
  "editor-component_fs": state.isFullScreen,
}));
const currentAuthorizedUserId = computed(() => store.getters.auth.id);
const currentAuthorizedUserAvatar = computed(() => ({
  backgroundImage: `url(https://leonardo.osnova.io/${store.getters.auth.avatar.data.uuid}/-/format/webp/)`,
}));

// mounted
onMounted(() => {
  state.subsite_id = currentAuthorizedUserId;
  focusTitle();
});
</script>

<template>
  <div
    class="editor-component"
    :class="componentClassObj"
    v-on-keydown="{ key: 'Escape', callback: props.closeEditor }"
    v-scroll-lock:[true]="props.isVisible"
    v-outside-click:[true]="props.closeEditor"
  >
    <div class="editor-component__controls">
      <div class="size-control" @click="toggleFullScreen">
        <MaximizeIcon class="icon" v-if="!state.isFullScreen" />
        <MinimizeIcon class="icon" v-if="state.isFullScreen" />
      </div>
      <div class="close-control" @click="props.closeEditor">
        <CloseIcon class="icon" />
      </div>
    </div>
    <div class="editor-component__body">
      <div class="body-header">
        <div class="subsite-selector">
          <div class="avatar" :style="currentAuthorizedUserAvatar"></div>
          <span class="label">Мой блог</span>
          <ChevronDownIcon class="icon" />
        </div>
      </div>

      <div class="body-content">
        <div class="content__title">
          <div class="placeholder" v-if="!state.title">Заголовок</div>
          <div
            class="label"
            contenteditable="true"
            @input="titleChangeHandler"
            ref="titleInputRef"
          ></div>
        </div>
        <div class="content__text">
          <div class="placeholder" v-if="!state.text">Текст</div>
          <div
            class="label"
            contenteditable="true"
            @input="textChangeHandler"
          ></div>
        </div>
      </div>

      <div class="body-footer">
        <div class="actions">
          <button
            class="publish button button_b"
            @click="createEntry"
            :disabled="
              !(state.title || state.text || state.attachments) ||
              state.createEntryIsRequested
            "
          >
            <span class="button__label" v-if="!state.createEntryIsRequested"
              >Опубликовать</span
            >
            <template v-if="state.createEntryIsRequested">
              <Loader color="#fff" />
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.editor-component {
  position: relative;
  max-width: 800px;
  width: 100%;
  max-height: 750px;
  height: 100%;
  color: var(--black-color);
  background: var(--modal-bg-light);
  border-radius: 8px;

  &__controls {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;

    .size-control,
    .close-control {
      padding: 12px 6px;
      color: var(--grey-color);
      cursor: pointer;
    }

    .close-control {
      padding: 12px;
    }
  }

  &__body {
    margin: 0 auto;
    padding: 30px 0;
    max-width: 600px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .body-header {
      display: flex;

      .subsite-selector {
        display: flex;
        align-items: center;
        cursor: pointer;

        .avatar {
          width: 22px;
          height: 22px;
          background-size: cover;
          border-radius: 6px;
          box-shadow: inset 0 0 0 1px var(--box-shadow-avatar);
        }

        .label {
          margin-left: 7px;
        }

        .icon {
          margin-left: 3px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .body-content {
      margin-top: 20px;
      line-height: 1.5;
      overflow-y: auto;

      .content__title,
      .content__text {
        position: relative;

        .label {
          position: relative;
          outline: none;
        }

        .placeholder {
          position: absolute;
          top: 0;
          left: 0;
          color: var(--grey-color-lighter);
        }
      }

      .content__title {
        font-size: 26px;
        font-weight: 500;
      }

      .content__text {
        margin-top: 10px;
        font-size: 17px;
      }
    }

    .body-footer {
      margin-top: auto;
      padding-top: 20px;
      display: flex;

      .actions {
        .publish {
          width: 140px;
          height: 40px;
        }
      }
    }
  }

  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

  &_fs {
    padding: 30px 0;
    max-width: unset;
    max-height: unset;
    border-radius: 0;
  }
}

@media (max-width: 800px) {
  .editor-component {
    max-width: unset;
    max-height: unset;
    border-radius: 0;

    &__controls {
      .size-control {
        display: none;
      }
    }

    &__body {
      padding: 25px;
    }
  }
}

@media (hover: hover) {
  .editor-component {
    &__controls {
      .size-control,
      .close-control {
        &:hover {
          color: var(--black-color);
        }
      }
    }
  }
}
</style>