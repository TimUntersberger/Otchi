<template>
  <div class="column justify-center">
    <div>
      <q-btn flat size="17px" color="secondary" @click="$emit('back')">
        <q-icon left name="keyboard_backspace"></q-icon>
        back
      </q-btn>
    </div>
    <video controls class="q-mx-auto" width="1280" height="720" ref="$video">
      <source :src="videoSource" type="video/webm" />
    </video>
    <div class="row q-mt-lg justify-center">
      <q-btn
        :unelevated="currentEpisode == ep.number"
        :outline="currentEpisode != ep.number"
        squared
        style="width: 40px"
        class="q-mx-sm"
        color="accent"
        v-for="(ep, index) in episodes"
        :key="index"
        @click="watchEpisode(ep.number)"
      >
        {{ ep.number }}
      </q-btn>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import api, { Episode } from "@/lib/api";

export default defineComponent({
  name: "AnimeView",
  props: {
    anime: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const $video = ref<HTMLVideoElement | null>(null);
    const videoSource = ref("");
    const episodes = ref<Episode[]>([]);
    const currentEpisode = ref(1);

    watchEffect(async () => {
      api.anime.download(props.anime.id, currentEpisode.value).then(urls => {
        videoSource.value = urls.video;
        $video.value?.load();
      });

      episodes.value = await api.anime.getEpisodes(props.anime as any);
    });

    function watchEpisode(number: number) {
      currentEpisode.value = number;
    }

    return {
      $video,
      episodes,
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
