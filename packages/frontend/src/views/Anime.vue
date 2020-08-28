<template>
    <div>
        <anime-view
            v-if="selectedAnime"
            :anime="selectedAnime"
            @back="viewAnime(null)"
        ></anime-view>
        <div v-else>
            <q-toolbar class="bg-dark text-grey-5 text-bold row justify-end">
                <q-tabs v-model="route" indicator-color="transparent" active-color="white">
                    <q-tab :ripple="false" name="overview" label="Overview"></q-tab>
                    <q-tab :ripple="false" name="browse" label="Browse"></q-tab>
                </q-tabs>
            </q-toolbar>
            <div v-if="route == 'browse'" class="q-pt-xl">
                <anime-search @selected="viewAnime"></anime-search>
            </div>
            <div v-else-if="route == 'overview'">
                <media-list
                    title="Recent"
                    @click="x => viewAnime(x.anime)"
                    :items="recentAsTableData"
                ></media-list>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api";
import AnimeView from "../components/AnimeView.vue";
import AnimeSearch from "../components/AnimeSearch.vue";
import MediaList from "../components/MediaList.vue";
import api, { Anime } from "../lib/api";

export default defineComponent({
    components: {
        AnimeView,
        AnimeSearch,
        MediaList
    },
    setup() {
        const route = ref("overview");
        const recent = ref<any[]>([]);
        const selectedAnime = ref<Anime | null>(null);

        function viewAnime(anime: Anime) {
            getRecent();
            selectedAnime.value = anime;
        }

        async function getRecent() {
            const animes: any[] = [];
            for(let i = 0; i < localStorage.length; i++){
                const key = localStorage.key(i)!;

                if(key.startsWith("anime-")) {
                    const episode = Number(localStorage.getItem(key));
                    const anime = Number(key.split("-").pop());

                    animes.push([anime, episode]);
                }
            }

            const result = await api.anime.getByIds(animes.map(x => x[0]));

            recent.value = result.map((anime, i) => {
                return {
                    anime,
                    episode: animes[i][1]
                }
            })
        }

        const recentAsTableData = computed(() => {
            return recent.value.map(({ anime, episode }) => ({
                anime,
                cover: anime.cover,
                title: anime.title,
                progress: `Episode ${episode} / ${(anime.nextEpisodeNumber - 1) || anime.episodeCount}`
            }))
        })

        getRecent();

        return {
            viewAnime,
            recent,
            recentAsTableData,
            route,
            selectedAnime
        };
    }
});
</script>
