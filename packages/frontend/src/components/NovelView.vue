<template>
    <div class="column content-stretch">
        <q-toolbar class="bg-dark text-grey-5 text-bold">
            <q-btn
                flat
                padding="none"
                :ripple="false"
                class="q-mr-sm"
                icon="keyboard_backspace"
                @click="$emit('back')"
            />
            <span>{{ novel.title }}</span>
            <span class="q-mx-sm" style="font-size: 18px">/</span>
            <span class="q-mr-sm">Chapter {{ chapter.number }}:</span>
            <span>{{ chapter.title }}</span>
            <span class="q-mx-sm" style="font-size: 19px">|</span>
            <span>{{(chapter.number / chapterCount * 100).toFixed(2)}}%</span>
        </q-toolbar>
        <q-scroll-area
            class="q-mt-sm q-mx-auto q-px-md col full-height full-width"
            style="height: 90vh; font-size: 16px"
            @scroll="onScroll"
        >
            <q-infinite-scroll @load="loadMore" :offset="400" class="q-mx-auto" style="max-width: 700px">
                <div
                    v-for="(chapter, index) in chapters"
                    :key="index"
                    :data-chapter="chapter.number"
                >
                    <h5>Chapter {{ chapter.number }}: {{ chapter.title }}</h5>
                    <p v-for="(text, index) in chapter.content" :key="index">
                        {{ text }}
                    </p>
                    <q-separator></q-separator>
                </div>
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner-dots color="primary" size="40px" />
                    </div>
                </template>
            </q-infinite-scroll>
        </q-scroll-area>
    </div>
</template>
<script lang="ts">
import {
    defineComponent,
    ref,
    watchEffect,
    computed,
    watch
} from "@vue/composition-api";
import logger from "../logger/renderer";
import api, { Chapter } from "../lib/api";
import { LocalStorage } from "quasar";

export default defineComponent({
    name: "NovelView",
    props: {
        novel: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const chapters = ref<
            (Chapter & {
                content: string[];
            })[]
        >([]);
        const chapterNumber = ref(Number(localStorage.getItem(`novel-${props.novel.slug}`)) || 1);
        const earliestChapterNumber = ref(chapterNumber.value);
        const latestChapterNumber = ref(chapterNumber.value);

        const chapter = computed<Chapter>(() => {
            return props.novel._chapters[chapterNumber.value];
        });

        watch([chapterNumber], () =>{
            localStorage.setItem(`novel-${props.novel.slug}`, String(chapterNumber.value))
        });

        async function loadMore(_idx: number, done: (x: boolean) => void) {
            const chapter = props.novel._chapters[latestChapterNumber.value];
            const result = await api.novel.content(
                props.novel.slug,
                chapter.id
            );
            chapters.value = [
                ...chapters.value,
                {
                    ...chapter,
                    content: result.map(x => {
                        const temp = '"' + x.trim().replace(/"/g, '\\"') + '"';
                        return decodeURIComponent(JSON.parse(temp));
                    }),
                    ref: null
                }
            ];
            latestChapterNumber.value++;
            done(result.length == 0);
        }

        function onScroll(x: any) {
            console.log(x);
            const centerElement = document.elementFromPoint(
                window.innerWidth / 2,
                window.innerHeight / 2
            );

            if (centerElement?.tagName == "DIV") {
                const attr = centerElement.getAttribute("data-chapter");
                if (attr) {
                    const chapter = Number(attr);
                    if (chapterNumber.value != chapter) {
                        logger.debug(`[NovelView] current chapter changed ${chapterNumber.value} -> ${chapter}`)
                        chapterNumber.value = chapter;
                    }
                }
            }
        }

        return {
            chapterCount: props.novel._chapters.length,
            chapter,
            chapters,
            loadMore,
            onScroll
        };
    }
});
</script>
<style lang="scss"></style>
