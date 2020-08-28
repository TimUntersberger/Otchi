<template>
    <div>
        <q-toolbar class="bg-dark text-grey-5 text-bold">
            <q-btn
                flat
                padding="none"
                :ripple="false"
                class="q-mr-sm"
                icon="keyboard_backspace"
                @click="$emit('back')"
            />
            <span>{{ anime.title }}</span>
            <span class="q-mx-sm" style="font-size: 18px">/</span>
            <span>Episode {{ currentEpisode }}</span>
            <span class="q-mx-sm" style="font-size: 19px">|</span>
            <span
                >{{
                    ((currentEpisode / anime.episodeCount) * 100).toFixed(2)
                }}%</span
            >
        </q-toolbar>
        <div
            class="q-mx-auto q-mt-xl column items-center justify-center bg-dark block relative-position"
            style="height: 720px; width: 1280px; max-width: 1280px; width: 1280px"
        >
            <video
                controls
                style="height: 720px; max-height: 720px; max-width: 1280px; width: 1280px"
                ref="$video"
            >
                <source :src="videoSource" type="video/webm" />
            </video>
            <q-inner-loading :showing="loadingEpisode">
                <q-spinner-hourglass size="4em"></q-spinner-hourglass>
                <span style="font-size: 1.4em">
                    Episode {{ currentEpisode }}
                </span>
            </q-inner-loading>
        </div>
        <div class="row q-mt-lg justify-center">
            <q-pagination
                v-model="currentEpisode"
                color="accent"
                :max="(anime.nextEpisodeNumber - 1) || anime.episodeCount"
                :max-pages="10"
                :boundary-numbers="true"
                :direction-links="true"
            >
            </q-pagination>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, onUnmounted } from "@vue/composition-api";
import api, { Anime } from "../lib/api";
import logger from "../logger/renderer";

export default defineComponent({
    name: "AnimeView",
    props: {
        anime: {
            type: Object,
            required: true
        }
    },
    setup(props: { anime: Anime }) {
        const loadingEpisode = ref(true);
        const $video = ref<HTMLVideoElement | null>(null);
        const videoSource = ref("");
        const currentEpisode = ref(
            Number(localStorage.getItem(`anime-${props.anime.id}`)) || 1
        );

        async function getVideoUrl() {
            loadingEpisode.value = true;
            api.anime
                .getVideoUrl(props.anime.id, currentEpisode.value)
                .then(urls => {
                    loadingEpisode.value = false;
                    videoSource.value = urls.video;
                    $video.value?.load();
                });
        }

        getVideoUrl();

        onUnmounted(() => {
            logger.debug(`[AnimeView] Clearing interval`);
        });

        watch([currentEpisode], () => {
            localStorage.setItem(
                `anime-${props.anime.id}`,
                String(currentEpisode.value)
            );
            getVideoUrl();
        });

        function watchEpisode(number: number) {
            currentEpisode.value = number;
        }

        return {
            $video,
            loadingEpisode,
            currentEpisode,
            watchEpisode,
            videoSource
        };
    }
});
</script>
<style lang="scss">
video::cue {
    color: white;
    font-weight: bold;
    text-shadow: -1.5px 0 black, 0 1.5px black, 1.5px 0 black, 0 -1.5px black;
    background-color: transparent;
}
</style>
