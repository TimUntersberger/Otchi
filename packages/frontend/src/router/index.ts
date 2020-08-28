import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        redirect: "/anime",
    },
    {
        path: "/anime*",
        component: () => import("@/views/Anime.vue"),
    
    },
    {
        path: "/manga",
        component: () => import("@/views/Manga.vue"),
    },
    {
        path: "/novel",
        component: () => import("@/views/Novel.vue"),
    },
    {
        path: "/settings",
        component: () => import("@/views/Settings.vue"),
    },
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
