import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import mitt from "mitt";
import nProgress from "nprogress";

const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;
nProgress.configure({ showSpinner: false, parent: ".header" });

app.directive("outside-click", {
  mounted(el, binding) {
    function hundleClick(e) {
      if (binding.value.ignore === false && !el.contains(e.target)) {
        emitter.emit(binding.value.emitterName);
      }
    }

    document.addEventListener("click", hundleClick);
  },

  beforeUnmount() {
    document.removeEventListener("click", hundleClick);
  },
});

app.use(store).use(router).mount("body");
