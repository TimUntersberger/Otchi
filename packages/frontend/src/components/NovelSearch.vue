<template>
    <div class="column items-center full-height">
        <q-input
            v-model="search"
            borderless
            filled
            type="search"
            debounce="500"
            placeholder="Search..."
            dense
            :loading="loading"
            style="width: 500px; max-width: 500px"
        ></q-input>
        <div>
            <q-scroll-area class="q-mt-xl" style="height: 80vh; width: 70vw">
                <q-infinite-scroll
                    v-if="search != ''"
                    @load="loadMore"
                    :offset="250"
                >
                    <div v-for="novel in results" :key="novel.slug" class="row justify-center">
                        <q-card class="my-card cursor-pointer" style="width: 500px" flat square bordered @click="onClick(novel)">
                            <q-card-section horizontal>
                                <q-img width="100px" height="150px" class="col-5" :src="novel.cover" />
                                <q-card-section>
                                    {{ novel.title }}
                                </q-card-section>
                            </q-card-section>
                        </q-card>
                    </div>
                </q-infinite-scroll>
            </q-scroll-area>
        </div>
    </div>
</template>
<script lang="ts">
import {
    defineComponent,
    ref,
    watch,
} from "@vue/composition-api";
import api, { Novel } from "../lib/api";

export default defineComponent({
    name: "NovelSearch",
    setup() {
        const search = ref("");
        const loading = ref(false);
        const results = ref<Novel[]>([]);

        watch([search], async () => {
            if (search.value != "") {
                loading.value = true;
                const result = await api.novel.search(search.value);
                results.value = result;
                loading.value = false;
            }
        });

        async function loadMore(index: number, done: (x: boolean) => void) {
            loading.value = true;
            const result = await api.novel.search(search.value, index + 1);
            results.value = [...results.value, ...result];
            done(result.length == 0);
            loading.value = false;
        }

        function onClick(item: Novel) {
            // eslint-disable-next-line
            // @ts-ignore
            this.$emit("selected", item);
        }

        return {
            search,
            results,
            loadMore,
            loading,
            onClick
        };
    }
});
</script>
