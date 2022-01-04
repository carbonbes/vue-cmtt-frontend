import { createRouter, createWebHistory } from "vue-router";
import Feed from "../views/Feed.vue";

const routes = [
  {
    path: "/:sorting?",
    name: "Feed",
    component: Feed,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
