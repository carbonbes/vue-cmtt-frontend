import {
  enableBodyScroll,
  disableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

export default {
  install: (app, options) => {
    app.directive("scroll-lock", {
      mounted(el, binding) {
        if (binding.arg && binding.value) {
          disableBodyScroll(el, {
            reserveScrollBarGap: true,
          });
        } else {
          enableBodyScroll(el);
        }
      },

      updated(el, binding) {
        if (binding.arg && binding.value) {
          disableBodyScroll(el, {
            reserveScrollBarGap: true,
          });
        } else {
          enableBodyScroll(el);
        }
      },

      unmounted(el) {
        clearAllBodyScrollLocks(el);
      },
    });
  },
};
