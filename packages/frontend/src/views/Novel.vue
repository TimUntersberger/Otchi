<template>
    <novel-view v-if="selectedItem" :novel="selectedItem" @back="onSelected(null)"></novel-view>
    <novel-search v-else @selected="onSelected"></novel-search>
</template>
<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import NovelSearch from "@/components/NovelSearch.vue";
import NovelView from "@/components/NovelView.vue";
import api, { Novel } from "../lib/api";

export default defineComponent({
    components: {
        NovelSearch,
        NovelView
    },
    setup() {
        const selectedItem = ref<Novel | null>(null);

        async function onSelected(novel: Novel | null) {
            if (novel) {
                const chapters = await api.novel.getChapters(novel);
                novel._chapters = chapters;
                selectedItem.value = novel;
            } else {
                selectedItem.value = null;
            }
        }

        return {
            selectedItem,
            onSelected
        }
    }
});
</script>

