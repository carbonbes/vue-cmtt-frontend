import { createRouter, createWebHistory } from "vue-router";
import FeedPage from "@/views/FeedPage.vue";
import EntryPage from "@/views/EntryPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import ProfileEntries from "@/components/ProfilePage/ProfileEntries.vue";
import ProfileComments from "@/components/ProfilePage/ProfileComments.vue";

const routes = [
  {
    path: "/:allSite?/:sorting?",
    name: "FeedPage",
    component: FeedPage,
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
    alias: "/s/:id(\\d+)",
    children: [
      {
        path: "entries",
        component: ProfileEntries,
        alias: "",
      },
      {
        path: "comments",
        component: ProfileComments,
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
          (from.name === "EntryPage" || from.name !== "EntryPage") &&
          to.name === "EntryPage" &&
          from.params.id !== to.params.id &&
          to.query.comment
        ) {
          resolve({ el: "#" + to.query.comment, top: 75 });
        }

        if (
          from.name === "EntryPage" &&
          to.name === "EntryPage" &&
          from.params.id === to.params.id &&
          to.query.comment
        ) {
          resolve({ el: "#" + to.query.comment, top: 75, behavior: "smooth" });
        }

        if (to.name === "EntryPage" && to.query.comments === null) {
          resolve({ el: "#entry-page__comments", top: 60 });
        }

        if (savedPosition) resolve(savedPosition);
        
        if (!savedPosition) resolve({ top: 0 });
      }, 0);
    });
  },
});

router.beforeEach((to, from, next) => {
  if (to.name === "FeedPage") {
    let allSite = localStorage.getItem("allSite");

    let allSorting = localStorage.getItem("all-saved-sorting");
    let mySorting = localStorage.getItem("my-saved-sorting");

    if (!allSite && (!allSorting || !mySorting) && !to.params.sorting) {
      next("/all/popular");
    } else if (
      allSite === "all" &&
      allSorting === "date" &&
      !to.params.sorting
    ) {
      next("/all/new");
    } else if (
      allSite === "all" &&
      (allSorting === "hotness" || !allSorting) &&
      !to.params.sorting
    ) {
      next("/all/popular");
    } else if (allSite === "my" && mySorting === "date" && !to.params.sorting) {
      next("/my/new");
    } else if (
      allSite === "my" &&
      (mySorting === "hotness" || !mySorting) &&
      !to.params.sorting
    ) {
      next("/my/popular");
    } else next();
  } else next();
});

export default router;
