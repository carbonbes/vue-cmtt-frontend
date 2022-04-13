<template>
  <div class="reply-form" :class="replyFormClassObj">
    <p
      class="reply-form__text-field"
      :class="textFieldClassObj"
      :contenteditable="commentIsSended ? false : true"
      @click="focusReplyForm"
      @input="replyTextHandler"
      v-on-click-outside="unfocusReplyForm"
      ref="textFieldRef"
      v-text="props.text"
    />
    <div class="reply-form__actions">
      <div class="attaches-actions"></div>
      <div class="reply-actions">
        <div
          class="cancel-btn"
          v-if="props.type === 'reply'"
          @click="closeReplyForm"
        >
          Отменить
        </div>
        <div class="button button_b" :class="replyFormBtn" @click="postComment">
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
import { computed, reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import LoaderIcon from "@/components/Loader.vue";

const props = defineProps({
  parentCommentId: String,
  type: String,
  closeReplyForm: Function,
});

const store = useStore();

const state = reactive({
  replyFormFocused: null,
  text: "",
  attachments: null,
});

const textFieldRef = ref(null);

// getters
const entryId = computed(() => store.getters.entryId);

const commentIsSended = computed(() => store.getters.commentIsSended);

const replyFormClassObj = computed(() => ({
  "reply-form_focused": state.replyFormFocused,
  "reply-form_sending": commentIsSended.value,
}));

const textFieldClassObj = computed(() => ({
  "reply-form__text-field_writes-0": !state.text && props.type === "root",
  "reply-form__text-field_writes-1": !state.text && props.type === "reply",
}));

const replyFormBtn = computed(() => ({
  button_disabled: !state.text.length,
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
  store.commit("clearIdCommentVisibledReplyForm");
};

const replyTextHandler = (e) => {
  state.text = e.target.innerText.trim();
};

const postComment = () => {
  store
    .dispatch("postComment", {
      id: entryId.value,
      text: state.text,
      reply_to: props.parentCommentId || 0,
      attachments: state.attachments,
    })
    .then(() => {
      if (props.type === "reply") {
        closeReplyForm();
      } else if (props.type === "root") {
        props.closeReplyForm();
      }
    });
};

onMounted(() => {
  focusReplyForm();
});
</script>