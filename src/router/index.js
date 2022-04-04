import { createRouter, createWebHistory } from "vue-router";
import Feed from "@/views/Feed.vue";
import EntryPage from "@/views/EntryPage.vue";

const routes = [
  {
    path: "/:sorting?",
    name: "FeedPage",
    component: Feed,
    beforeEnter: (to, from, next) => {
      let sorting = localStorage.getItem("saved-sorting");

      if (!sorting && !to.params.sorting) {
        next();
      } else if (sorting === "date" && !to.params.sorting) {
        next("/new");
      } else next();
    },
  },
  {
    path: "/:id(\\d+)",
    name: "EntryPage",
    component: EntryPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          from.name === "EntryPage" &&
          to.name === "EntryPage" &&
          to.query.comment
        )
          resolve({ el: "#" + to.query.comment, top: 75, behavior: "smooth" });

        if (
          from.name !== "EntryPage" &&
          to.name === "EntryPage" &&
          to.query &&
          to.query.comment
        )
          resolve({ el: "#" + to.query.comment, top: 75 });

        if (savedPosition) resolve(savedPosition);

        if (!savedPosition) resolve({ top: 0 });
      }, 0);
    });
  },
});

export default router;
