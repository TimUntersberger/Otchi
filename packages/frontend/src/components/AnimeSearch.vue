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
        <q-infinite-scroll v-if="search != ''" @load="loadMore" :offset="250">
          <div
            v-for="anime in results"
            :key="anime.id"
            class="row justify-center"
          >
            <q-card
              class="my-card cursor-pointer"
              style="width: 500px"
              flat
              square
              bordered
              @click="viewAnime(anime)"
            >
              <q-card-section horizontal>
                <q-img
                  width="100px"
                  height="150px"
                  class="col-5"
                  :src="anime.cover"
                />
                <q-card-section>
                  {{ anime.title }}
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-scroll-area>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import api, { Anime } from "@/lib/api";

export default defineComponent({
  name: "AnimeSearch",
  setup() {
    const search = ref("");
    const loading = ref(false);
    const results = ref<Anime[]>([]);

    watch([search], async () => {
      if (search.value != "") {
        loading.value = true;
        const result = await api.anime.search(search.value);
        results.value = result;
        loading.value = false;
      }
    });

    async function loadMore(index: number, done: (x: boolean) => void) {
      loading.value = true;
      const result = await api.anime.search(search.value, index + 1);
      console.log(result);
      results.value = [...results.value, ...result];
      done(result.length == 0);
      loading.value = false;
    }

    function viewAnime(anime: Anime) {
      // eslint-disable-next-line
            // @ts-ignore
      this.$emit("anime-selected", anime);
    }

    return {
      search,
      results,
      loadMore,
      loading,
      viewAnime
    };
  }
});
</script>
