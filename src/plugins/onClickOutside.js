export default {
  install: (app, options) => {
    app.directive("outside-click", {
      mounted(el, binding) {
        el.onClickOutsideHandler = (e) => {
          if (e.target !== el && !el.contains(e.target) && binding.arg) {
            binding.value();
          }
        };

        document.addEventListener("mousedown", el.onClickOutsideHandler);
      },

      updated(el, binding) {
        document.removeEventListener("mousedown", el.onClickOutsideHandler);

        el.onClickOutsideHandler = (e) => {
          if (e.target !== el && !el.contains(e.target) && binding.arg) {
            binding.value();
          }
        };

        document.addEventListener("mousedown", el.onClickOutsideHandler);
      },

      beforeUnmount(el) {
        document.removeEventListener("mousedown", el.onClickOutsideHandler);
      },
    });
  },
};
