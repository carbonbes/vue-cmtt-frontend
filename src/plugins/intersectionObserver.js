export default {
  install: (app, options) => {
    app.directive("intersect", {
      mounted(el, binding) {
        el.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && binding.value.type === "when-appears") {
                binding.value.callback();
                el.observer.disconnect();
              } else if (!entry.isIntersecting && binding.value.type === "when-hide") {
                binding.value.callback();
                el.observer.disconnect();
              }
            });
          },
          { threshold: binding.value.threshold }
        );

        el.observer.observe(el);
      },

      unmounted(el) {
        el.observer.disconnect();
      },
    });
  },
};
