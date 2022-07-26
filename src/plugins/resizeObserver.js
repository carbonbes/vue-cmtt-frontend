export default {
  install: (app, options) => {
    app.directive("resize", {
      mounted(el, binding) {
        el.observer = new ResizeObserver(() => {
          binding.value();
        });

        el.observer.observe(el);
      },

      beforeUpdate(el) {
        el.observer.disconnect();
      },

      updated(el, binding) {
        el.observer = new ResizeObserver(() => {
          binding.value();
        });

        el.observer.observe(el);
      },

      unmounted(el) {
        el.observer.disconnect();
      },
    });
  },
};
