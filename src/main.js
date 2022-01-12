import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import mitt from "mitt";
import nProgress from "nprogress";

const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;
nProgress.configure({ showSpinner: false, parent: ".loader" });

app.directive("outside-click", {
  beforeMount(el, binding) {
    el.hundleClick = function (e) {
      if (!binding.arg && !el.contains(e.target)) {
        binding.value();
      }
    };

    document.addEventListener("click", el.hundleClick);
  },

  beforeUnmount(el) {
    document.removeEventListener("click", el.hundleClick);
  },
});

app.use(store).use(router).mount("body");
