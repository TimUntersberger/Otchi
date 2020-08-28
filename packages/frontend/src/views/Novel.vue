<template>
    <novel-view
        v-if="selectedItem"
        :novel="selectedItem"
        @back="onSelected(null)"
    ></novel-view>
    <div v-else>
        <q-toolbar class="bg-dark text-grey-5 text-bold row justify-end">
            <q-tabs
                v-model="route"
                indicator-color="transparent"
                active-color="white"
            >
                <q-tab :ripple="false" name="overview" label="Overview"></q-tab>
                <q-tab :ripple="false" name="browse" label="Browse"></q-tab>
            </q-tabs>
        </q-toolbar>
        <div v-if="route == 'browse'" class="q-pt-xl">
            <novel-search @selected="onSelected"></novel-search>
        </div>
        <div v-else-if="route == 'overview'">
            <media-list
                title="Recent"
                @click="x => onSelected(x.novel)"
                :items="recentAsTableData"
            ></media-list>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api";
import NovelSearch from "@/components/NovelSearch.vue";
import NovelView from "@/components/NovelView.vue";
import MediaList from "@/components/MediaList.vue";
import api, { Novel } from "../lib/api";

export default defineComponent({
    components: {
        NovelSearch,
        NovelView,
        MediaList
    },
    setup() {
        const recent = ref<any[]>([]);
        const route = ref("overview");
        const selectedItem = ref<Novel | null>(null);

        async function onSelected(novel: Novel | null) {
            getRecent();
            if (novel) {
                if (novel._chapters.length == 0) {
                    novel._chapters = await api.novel.getChapters(novel);
                }
                selectedItem.value = novel;
            } else {
                selectedItem.value = null;
            }
        }

        async function getRecent() {
            const novels: any[] = [];
            for(let i = 0; i < localStorage.length; i++){
                const key = localStorage.key(i)!;

                if(key.startsWith("novel-")) {
                    const chapter = Number(localStorage.getItem(key));
                    const novel = key.split("-").slice(1).join("-");

                    novels.push([novel, chapter]);
                }
            }

            recent.value = await Promise.all<any>(novels.map(async ([slug, chapter]) => {
                const novel = await api.novel.getBySlug(slug);
                return [novel, chapter];
            }))
        }

        getRecent();

        const recentAsTableData = computed(() => {
            return recent.value.map(([novel, chapter]) => ({
                novel,
                cover: novel.cover,
                title: novel.title,
                progress: `Chapter ${chapter} / ${novel._chapters.length}`
            }))
        })

        return {
            route,
            selectedItem,
            recentAsTableData,
            onSelected
        };
    }
});
</script>
