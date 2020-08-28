import Vue from 'vue'
import VueRouter from 'vue-router'
import AnimeView from "@/views/Anime.vue"
import MangaView from "@/views/Manga.vue"
import NovelView from "@/views/Novel.vue"
import SettingsView from "@/views/Settings.vue"

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        redirect: "/anime",
    },
    {
        path: "/anime*",
        component: AnimeView,
    
    },
    {
        path: "/manga",
        component: MangaView,
    },
    {
        path: "/novel",
        component: NovelView,
    },
    {
        path: "/settings",
        component: SettingsView,
    },
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
