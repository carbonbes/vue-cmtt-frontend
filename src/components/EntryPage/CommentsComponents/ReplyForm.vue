<template>
  <div class="reply-form" :class="replyFormClassObj">
    <div class="content">
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
        :contenteditable="commentIsSended ? false : true"
        @click="focusReplyForm"
        @input="replyTextHandler"
        @paste="onPasteHandler"
        v-on-click-outside:[true]="{
          state: state.replyFormFocused,
          callback: unfocusReplyForm,
        }"
        ref="textFieldRef"
      ></p>
    </div>
    <div class="attachments" v-if="state.attachments.length">
      <div
        class="attachments__item"
        v-for="(attachment, index) in state.attachments"
        :key="index"
      >
        <img
          :src="`https://leonardo.osnova.io/${attachment.data.uuid}/-/preview/200x200/-/format/webp/`"
          alt=""
        />
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
          <LoaderIcon />
        </div>
      </div>
      <div class="reply-actions">
        <div class="cancel-btn" @click="closeReplyForm">Отменить</div>
        <div
          class="button button_b"
          :class="replyFormBtnClassObj"
          @click="postComment"
        >
          <template v-if="!commentIsSended">
            <div class="button__label">Ответить</div>
          </template>
          <template v-if="commentIsSended">
            <LoaderIcon />
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
import LoaderIcon from "@/components/Loader.vue";

const store = useStore();
const emitter = inject("emitter");

const props = defineProps({
  parentCommentId: String,
  type: String,
  closeReplyForm: Function,
});

const state = reactive({
  replyFormFocused: false,
  text: "",
  attachments: [],
  uploadedAttachment: false,
});

const textFieldRef = ref(null);

// getters
const isAuth = computed(() => store.getters.isAuth);

const entryId = computed(() => store.getters.entryId);

const commentIsSended = computed(() => store.getters.commentIsSended);

const replyFormClassObj = computed(() => ({
  "reply-form_focused": state.replyFormFocused,
  "reply-form_sending": commentIsSended.value,
}));

const textFieldClassObj = computed(() => ({
  "reply-form__text-field_empty": !state.text.length,
}));

const replyFormBtnClassObj = computed(() => ({
  button_disabled: !state.text.length && !state.attachments.length,
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
  props.closeReplyForm();
};

const replyTextHandler = (e) => {
  e.preventDefault();

  state.text = e.target.textContent.trim();
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
      title: "Внимание",
      type: "warn",
      text: "Подождите, пока загрузится текущее прикрепление",
    });
  } else if (
    e.clipboardData.files.length > 0 &&
    state.attachments.length === 2
  ) {
    notify({
      title: "Ошибка",
      type: "error",
      text: "Максимально можно прикрепить только два файла к комментарию, удалите один из них и повторите попытку",
    });
  }

  if (e.clipboardData.getData("text/plain").trim().length > 0) {
    let text = e.clipboardData
      .getData("text/plain")
      .replace(/(<([^>]+)>)/gi, "");
    document.execCommand("insertText", false, text);

    state.text = text;
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

const postComment = () => {
  if (isAuth.value) {
    store
      .dispatch("postComment", {
        id: entryId.value,
        text: state.text,
        reply_to: props.parentCommentId || 0,
        attachments: JSON.stringify(state.attachments),
      })
      .then(() => {
        props.closeReplyForm();
      });
  } else {
    emitter.emit("login-modal-toggle");
  }
};

onMounted(() => {
  focusReplyForm();
});
</script>