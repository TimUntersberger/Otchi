<template>
  <div id="q-app" style="height: 100vh">
    <q-layout container>
      <q-drawer v-model="appbar" show-if-above :width="70" :breakpoint="0">
        <q-toolbar
          vertical
          class="bg-dark full-height col-auto column q-pa-none"
        >
          <q-tabs
            v-model="mode"
            vertical
            class="text-grey-5 col"
            indicator-color="transparent"
            active-color="primary"
          >
            <q-tab
              :ripple="false"
              @click="$router.push('anime')"
              name="anime"
              icon="personal_video"
              label="Anime"
            />
            <q-tab
              :ripple="false"
              @click="$router.push('manga')"
              name="manga"
              icon="menu_book"
              label="Manga"
            />
            <q-tab
              :ripple="false"
              @click="$router.push('novel')"
              name="novel"
              icon="book"
              label="Novel"
            />
          </q-tabs>
          <div class="col-auto full-width column items-center q-mb-sm">
            <q-skeleton :dark="true" type="QAvatar" />
            <span class="text-grey-5">Baaka</span>
          </div>
        </q-toolbar>
      </q-drawer>
      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    const mode = ref("anime");
    const appbar = ref(true);

    return {
      appbar,
      mode
    };
  }
});
</script>
