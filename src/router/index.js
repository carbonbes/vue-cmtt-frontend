import { createRouter, createWebHistory } from "vue-router";
import FeedPage from "@/views/FeedPage.vue";
import EntryPage from "@/views/EntryPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import ProfileEntries from "@/components/ProfilePage/ProfileEntries.vue";
import ProfileComments from "@/components/ProfilePage/ProfileComments.vue";

const routes = [
  {
    path: "/:pageName?/:sorting?",
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
    let savedFeedSettings = JSON.parse(
      localStorage.getItem("saved_feed_settings")
    );
    let pageName = savedFeedSettings?.pageName;
    let sorting = savedFeedSettings?.sorting;

    if (!pageName && !sorting && !to.params.pageName && !to.params.sorting) {
      next("/popular");
    } else if (
      pageName &&
      sorting &&
      !to.params.pageName &&
      !to.params.sorting
    ) {
      next(`/${pageName}/${sorting}`);
    } else if (
      (pageName || !pageName) &&
      (sorting || !sorting) &&
      (to.params.pageName || to.params.sorting)
    ) {
      next();
    }
  } else {
    next();
  }
});

export default router;
