import { createRouter, createWebHistory } from "vue-router";
import FeedPage from "@/views/FeedPage.vue";
import EntryPage from "@/views/EntryPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import ProfileEntries from "@/components/ProfilePage/ProfileEntries.vue";

const routes = [
  {
    path: "/:sorting?",
    name: "FeedPage",
    component: FeedPage,
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
  {
    path: "/u/:id(\\d+)",
    name: "ProfilePage",
    component: ProfilePage,
    children: [
      {
        path: "",
        component: ProfileEntries,
        alias: "entries"
      },
    ],
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

        if (
          from.name === "EntryPage" &&
          to.name === "EntryPage" &&
          to.query.comments === null
        )
          resolve({ el: "#entry-page__comments", top: 60, behavior: "smooth" });

        if (
          from.name !== "EntryPage" &&
          to.name === "EntryPage" &&
          to.query.comments === null
        )
          resolve({ el: "#entry-page__comments", top: 60 });

        if (savedPosition) resolve(savedPosition);

        if (!savedPosition) resolve({ top: 0 });
      }, 0);
    });
  },
});

export default router;
