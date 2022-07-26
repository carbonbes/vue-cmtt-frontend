export default {
  install: (app, options) => {
    app.directive("focus", {
      mounted(el) {
        el.focus();
      },
    });
  },
};
