<template>
  <div class="reply-form" :class="replyFormClassObj">
    <div class="reply-form__content">
      <div
        class="placeholder"
        v-if="props.type === 'root' && !state.text.length"
      >
        Написать комментарий...
      </div>
      <div
        class="placeholder"
        v-if="props.type === 'reply' && !state.text.length"
      >
        Написать ответ...
      </div>
      <p
        class="reply-form__text-field"
        :class="textFieldClassObj"
        contenteditable="true"
        @click="focusReplyForm"
        @input="replyTextHandler"
        @paste="onPasteHandler"
        v-outside-click:[true]="unfocusReplyForm"
        ref="textFieldRef"
      ></p>
    </div>
    <div class="attachments" v-if="state.attachments.length">
      <div
        class="attachments__item"
        v-for="(attachment, index) in state.attachments"
        :key="index"
      >
        <div class="attachment">
          <img
            :src="`https://leonardo.osnova.io/${attachment.data.uuid}/-/preview/200x200/-/format/webp/`"
            alt=""
          />
        </div>
        <div class="delete-btn" @click="deleteAttachment(index)">
          <delete-icon class="icon" />
        </div>
      </div>
    </div>
    <div class="reply-form__actions">
      <div class="attaches-actions">
        <label for="file"
          ><media-icon class="media-attach-btn" :class="mediaAttachBtnClassObj"
        /></label>
        <input
          class="media-attach-input-hidden"
          id="file"
          type="file"
          tabindex="-1"
          @change="attachmentsHandler"
          :disabled="state.attachments.length === 2"
        />
        <div class="attachments-loader" v-if="state.uploadedAttachment">
          <Loader color="var(--black-color)" />
        </div>
      </div>
      <div class="reply-actions">
        <div class="cancel-btn" @click="closeReplyForm">Отмена</div>
        <div
          class="button button_b"
          :class="replyFormBtnClassObj"
          @click="postComment"
        >
          <template v-if="!state.commentIsSended && !props.editMode">
            <div class="button__label">Ответить</div>
          </template>
          <template v-if="state.commentIsSended">
            <Loader color="#fff" />
          </template>
          <template v-if="props.editMode && !state.commentIsSended">
            <div class="button__label">Редактировать</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted, inject } from "vue";
import { useStore } from "vuex";
import { notify } from "@kyvg/vue3-notification";
import MediaIcon from "@/assets/logos/media_icon.svg?inline";
import Loader from "@/components/Loader.vue";
import DeleteIcon from "@/assets/logos/delete_icon.svg?inline";

const store = useStore();
const emitter = inject("emitter");

const textFieldRef = ref(null);

// props
const props = defineProps({
  parentCommentId: String,
  closeReplyForm: Function,
  closeEditForm: Function,
  position: String,
  editMode: Boolean,
  selfCommentText: String,
  selfCommentMedia: Object,
  type: String,
});

// state
const state = reactive({
  replyFormFocused: false,
  text: "",
  attachments: [],
  uploadedAttachment: false,
  commentIsSended: false,
});

// getters
const isAuth = computed(() => store.getters.isAuth);

const entryId = computed(() => store.getters.entryId);

// computed
const formIsFilled = computed(() => {
  return state.text.length > 0 || state.attachments.length > 0;
});

const replyFormClassObj = computed(() => ({
  "reply-form_focused": state.replyFormFocused,
  "reply-form_sending": state.commentIsSended,
  "reply-form_filled": formIsFilled.value,
}));

const textFieldClassObj = computed(() => ({
  "reply-form__text-field_empty": !state.text.length,
}));

const replyFormBtnClassObj = computed(() => ({
  button_disabled:
    (!state.text.length && !state.attachments.length) ||
    state.uploadedAttachment,
}));

const mediaAttachBtnClassObj = computed(() => ({
  "media-attach-btn_disabled": state.attachments.length === 2,
}));

// methods
const focusReplyForm = () => {
  state.replyFormFocused = true;
  textFieldRef.value.focus();
};

const unfocusReplyForm = () => {
  state.replyFormFocused = false;
};

const closeReplyForm = () => {
  if (props.editMode) {
    props.closeEditForm();
  } else {
    props.closeReplyForm();
  }
};

const replyTextHandler = (e) => {
  e.preventDefault();

  state.text = e.target.innerText.trim();
};

const onPasteHandler = (e) => {
  e.preventDefault();

  if (
    e.clipboardData.files.length > 0 &&
    state.attachments.length !== 2 &&
    !state.uploadedAttachment
  ) {
    state.uploadedAttachment = true;
    store
      .dispatch("uploadFile", e.clipboardData.files[0])
      .then((result) => {
        state.uploadedAttachment = false;
        state.attachments.push(result.data.result[0]);
      })
      .catch(() => (state.uploadedAttachment = false));
  } else if (
    e.clipboardData.files.length > 0 &&
    state.attachments.length !== 2 &&
    state.uploadedAttachment
  ) {
    notify({
      type: "error",
      text: "Подождите, пока загрузится текущий файл",
    });
  } else if (
    e.clipboardData.files.length > 0 &&
    state.attachments.length === 2
  ) {
    notify({
      type: "error",
      text: "Максимально можно прикрепить только два файла к комментарию, удалите один из них и повторите попытку",
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

const attachmentsHandler = (e) => {
  if (e.target.files.length > 0) {
    state.uploadedAttachment = true;
    store
      .dispatch("uploadFile", e.target.files[0])
      .then((result) => {
        state.uploadedAttachment = false;
        state.attachments.push(result.data.result[0]);
      })
      .catch(() => (state.uploadedAttachment = false));
  }
};

const deleteAttachment = (index) => {
  state.attachments.splice(index, 1);
};

const postComment = () => {
  if (isAuth.value) {
    if (!props.editMode) {
      state.commentIsSended = true;

      store
        .dispatch("postComment", {
          id: entryId.value,
          text: state.text,
          reply_to: props.parentCommentId || 0,
          attachments: JSON.stringify(state.attachments),
        })
        .then((response) => {
          store.commit("addComment", {
            position: props.position,
            comment: response.data.result,
          });

          state.commentIsSended = false;
          closeReplyForm();
        })
        .catch((error) => {
          state.commentIsSended = false;

          notify({
            type: "error",
            title: "Ошибка " + error.response.data.error.code,
            text: error.response.data.message,
          });
        });
    } else {
      state.commentIsSended = true;

      store
        .dispatch("editComment", {
          entryId: entryId.value,
          commentId: props.parentCommentId,
          text: state.text,
          attachments: JSON.stringify(state.attachments),
        })
        .then(() => {
          state.commentIsSended = false;
          closeReplyForm();
        })
        .catch((error) => {
          state.commentIsSended = false;

          notify({
            type: "error",
            title: "Ошибка " + error.response.data.error.code,
            text: error.response.data.message,
          });
        });
    }
  } else {
    emitter.emit("login-modal-toggle");
  }
};

onMounted(() => {
  focusReplyForm();

  if (props.editMode) {
    textFieldRef.value.innerText = props.selfCommentText;
    state.text = props.selfCommentText;
    state.attachments = [...props.selfCommentMedia];
  }
});
</script>