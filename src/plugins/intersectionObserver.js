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
                if (binding.value.callback !== null) {
                  binding.value.callback();
                  el.observer.disconnect();
                } else if (binding.value.videoType === "youtube") {
                  el.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                } if (binding.value.videoType === "vimeo") {
                  el.contentWindow.postMessage('{"method":"pause"}', '*');
                } else if (binding.value.videoType === "default") {
                  el.pause();
                }
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
