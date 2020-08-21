import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/anime"
  },
  {
    path: "/anime",
    component: () => import("@/views/Anime.vue")
  },
  {
    path: "/manga",
    component: () => import("@/views/Manga.vue")
  },
  {
    path: "/novel",
    component: () => import("@/views/Novel.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
