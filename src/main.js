import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Notifications from "@kyvg/vue3-notification";
import mitt from "mitt";
import nProgress from "nprogress";
import bodyScrollLock from "@/plugins/bodyScrollLock";
import onKeydown from "@/plugins/onKeydown";
import onClickOutside from "@/plugins/onClickOutside";
import intersectionObserver from "@/plugins/intersectionObserver";
import resizeObserver from "@/plugins/resizeObserver";
import focus from "@/plugins/focus";

const app = createApp(App);
const emitter = mitt();
app.config.globalProperties.emitter = emitter;
app.config.unwrapInjectedRef = true;
app.provide("emitter", emitter);
nProgress.configure({
  showSpinner: false,
  parent: ".loader",
  trickleSpeed: 40,
});

app
  .use(store)
  .use(router)
  .use(Notifications)
  .use(bodyScrollLock)
  .use(onKeydown)
  .use(onClickOutside)
  .use(intersectionObserver)
  .use(resizeObserver)
  .use(focus)
  .mount("body");
