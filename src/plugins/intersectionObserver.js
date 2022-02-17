export default {
  install: (app, options) => {
    app.directive("on-view", {
      mounted(el, binding) {
        el.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                entry.isIntersecting &&
                !binding.value.requestState &&
                binding.value.callback
              ) {
                binding.value.callback();
                el.observer.disconnect();
              }
            });
          },
          { threshold: 0 }
        );

        el.observer.observe(el);
      },

      unmounted(el) {
        el.observer.disconnect();
      },
    });
  },
};
