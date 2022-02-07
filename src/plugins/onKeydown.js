export default {
  install: (app, options) => {
    app.directive("on-keydown", {
      mounted(el, binding) {
        el.onKeydownHandler = function ({ key }) {
          switch (key) {
            case binding.value.key:
              binding.value.callback();
              break;
            default:
              break;
          }
        };

        document.addEventListener("keydown", el.onKeydownHandler);
      },

      unmounted(el) {
        document.removeEventListener("keydown", el.onKeydownHandler);
      },
    });
  },
};
