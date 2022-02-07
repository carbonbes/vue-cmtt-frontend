import {
  enableBodyScroll,
  disableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

export default {
  install: (app, options) => {
    app.directive("scroll-lock", {
      mounted(el, binding) {
        if (binding.value.state) {
          disableBodyScroll(el, {
            reserveScrollBarGap: binding.value.gap ? true : false,
          });
        }
      },

      updated(el, binding) {
        if (binding.value.state) {
          disableBodyScroll(el, {
            reserveScrollBarGap: binding.value.gap ? true : false,
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
