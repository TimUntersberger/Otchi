<template>
  <anime-view
    v-if="selectedAnime"
    :anime="selectedAnime"
    @back="viewAnime(null)"
  ></anime-view>
  <anime-search v-else @anime-selected="viewAnime"></anime-search>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import AnimeView from "@/components/AnimeView.vue";
import AnimeSearch from "@/components/AnimeSearch.vue";
import { Anime } from "@/lib/api";

export default defineComponent({
  components: {
    AnimeView,
    AnimeSearch
  },
  setup() {
    const selectedAnime = ref<Anime | null>(null);

    function viewAnime(anime: Anime) {
      selectedAnime.value = anime;
    }

    return {
      viewAnime,
      selectedAnime
    };
  }
});
</script>
