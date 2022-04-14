export default {
  install: (app, options) => {
    app.directive("on-click-outside", {
      mounted(el, binding) {
        el.onClickOutsideHandler = function (e) {
          if (!el.contains(e.target)) {
            if (binding.arg && binding.value.state) {
              binding.value.callback();
            }
          }
        };

        document.addEventListener("mousedown", el.onClickOutsideHandler);
      },

      updated(el, binding) {
        el.onClickOutsideHandler = function (e) {
          if (!el.contains(e.target)) {
            if (binding.arg && binding.value.state) {
              binding.value.callback();
            }
          }
        };

        document.addEventListener("mousedown", el.onClickOutsideHandler);
      },

      unmounted(el) {
        document.removeEventListener("mousedown", el.onClickOutsideHandler);
      },
    });
  },
};
