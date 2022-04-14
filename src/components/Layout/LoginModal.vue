<template>
  <div
    class="login-modal"
    v-on-keydown="{ key: 'Escape', callback: this.toggleShowLoginModal }"
    v-scroll-lock:[true]="this.isShow"
    v-on-click-outside:[true]="{
      state: this.isShow,
      callback: this.toggleShowLoginModal,
    }"
  >
    <Form
      class="login-modal__form"
      validateOnMount
      :initialValues="initialValues"
      :validationSchema="schema"
      @submit="postLogin"
      v-slot="{ meta }"
    >
      <h2 class="login-modal__title">Вход в аккаунт</h2>
      <Field
        class="login-modal__input v-input"
        name="email"
        type="email"
        placeholder="Почта"
        validateOnInput
        :disabled="isLoginRequested"
      />
      <Field
        class="login-modal__input v-input"
        name="password"
        type="password"
        placeholder="Пароль"
        validateOnInput
        :disabled="isLoginRequested"
      />
      <button
        class="login-modal__button button button_b"
        :disabled="!(meta.valid && meta.dirty) || isLoginRequested"
      >
        <template v-if="!isLoginRequested">Войти</template>
        <template v-if="isLoginRequested"><loader /></template>
      </button>
      <div class="login-modal__error-msg" v-if="!isLoginRequested && isError">
        Ошибка: {{ error.message }}
      </div>
    </Form>
    <close-icon
      class="login-modal__close-btn"
      @click="this.toggleShowLoginModal"
    />
  </div>
</template>

<script>
import { markRaw } from "vue";
import { mapActions, mapMutations, mapGetters } from "vuex";
import { Field, Form } from "vee-validate";
import { object, string } from "yup";
import CloseIcon from "@/assets/logos/close_icon.svg?inline";
import Loader from "@/components/Loader.vue";

export default {
  components: { Field, Form, CloseIcon, Loader },

  props: {
    isShow: Boolean,
  },

  data() {
    const initialValues = {
      email: "",
      password: "",
      rememberMe: true,
    };

    const schema = markRaw(
      object({
        email: string().email().trim().required(),
        password: string().trim().required(),
      })
    );

    return {
      initialValues,
      schema,
    };
  },

  methods: {
    toggleShowLoginModal() {
      this.emitter.emit("login-modal-toggle");
    },

    postLogin(data) {
      this.requestLogin(data);
    },

    ...mapActions(["requestLogin"]),

    ...mapMutations(["setIsError", "setError"]),
  },

  computed: {
    ...mapGetters(["isLoginRequested", "isError", "error"]),
  },

  beforeUnmount() {
    this.setIsError(false);
    this.setError([]);
  },
};
</script>

<style lang="scss">
.login-modal {
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--active-item-color);
  border-radius: 8px;

  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

  &__form {
    width: 250px;
    display: flex;
    flex-flow: column;
  }

  &__title {
    color: var(--black-color);
    text-align: center;
  }

  &__input {
    padding: 12px;
    height: 46px;
    border-radius: 8px;

    &:not(:first-child) {
      margin-top: 30px;
    }
  }

  &__button {
    margin-top: 30px;
    height: 46px;
    font-size: 15px;

    & .custom-loader {
      &__loader-1,
      &__loader-2,
      &__loader-3 {
        background-color: #fff;
      }
    }
  }

  &__error-msg {
    margin-top: 30px;
    color: var(--red-color);
  }

  &__close-btn {
    position: absolute;
    top: 0;
    right: 0;
    margin: 15px;
    width: 26px;
    height: 26px;
    color: var(--black-color);
    opacity: 0.7;
    cursor: pointer;
  }
}

@media (hover: hover) {
  .login-modal {
    &__close-btn {
      &:hover {
        opacity: 1;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .login-modal {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
</style>