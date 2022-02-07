<template>
  <div
    class="login-modal"
    v-on-keydown="{ key: 'Escape', callback: this.toggleShowLoginModal }"
    v-on-click-outside="this.toggleShowLoginModal"
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
        <template v-if="isLoginRequested">Ожидание...</template>
      </button>
      <div class="login-modal__error-msg" v-if="!isLoginRequested && isError">
        Ошибка: {{ error.message }}
      </div>
    </Form>
  </div>
</template>

<script>
import { markRaw } from "vue";
import { mapActions, mapGetters } from "vuex";
import { Field, Form } from "vee-validate";
import { object, string } from "yup";

export default {
  components: { Field, Form },

  data() {
    const initialValues = {
      email: "",
      password: "",
      rememberMe: true,
    };

    const schema = markRaw(
      object({
        email: string().email().required(),
        password: string().required(),
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
  },

  computed: {
    ...mapGetters(["isLoginRequested", "isError", "error"]),
  },
};
</script>

<style lang="scss">
.login-modal {
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
}

.login-modal__form {
  width: 250px;
  display: flex;
  flex-flow: column;
}

.login-modal__title {
  color: var(--black-color);
  text-align: center;
}

.login-modal__input {
  padding: 12px;
  height: 46px;
  border-radius: 8px;

  &:not(:first-child) {
    margin-top: 30px;
  }
}

.login-modal__button {
  margin-top: 30px;
  height: 46px;
  font-size: 15px;
}

.login-modal__error-msg {
  margin-top: 30px;
  color: var(--red-color);
}
</style>