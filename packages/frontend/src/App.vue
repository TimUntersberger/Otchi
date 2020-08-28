<template>
    <div id="q-app" style="height: 100vh">
        <q-layout container>
            <q-drawer
                v-model="appbar"
                show-if-above
                :width="65"
                :breakpoint="0"
            >
                <q-toolbar
                    vertical
                    class="bg-dark full-height col-auto column q-pa-none"
                >
                    <q-tabs
                        vertical
                        class="text-grey-5 col full-width"
                        indicator-color="transparent"
                        active-color="white"
                    >
                        <q-route-tab
                            :ripple="false"
                            to="anime"
                            name="anime"
                            icon="personal_video"
                            label="Anime"
                        />
                        <q-route-tab
                            :ripple="false"
                            to="manga"
                            name="manga"
                            icon="menu_book"
                            label="Manga"
                        />
                        <q-route-tab
                            :ripple="false"
                            to="novel"
                            name="novel"
                            icon="book"
                            label="Novel"
                        />
                    </q-tabs>
                    <q-tabs
                        vertical
                        class="text-grey-5 col-auto full-width"
                        indicator-color="transparent"
                        active-color="white"
                    >
                        <q-route-tab
                            :ripple="false"
                            to="settings"
                            name="Settings"
                            icon="settings"
                        />
                    </q-tabs>
                </q-toolbar>
            </q-drawer>
            <q-page-container style="overflow: hidden">
                <q-page>
                    <keep-alive>
                        <router-view :key="$route.fullPath" style="height: 100vh"></router-view>
                    </keep-alive>
                </q-page>
            </q-page-container>
        </q-layout>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
    name: "App",
    setup() {
        const appbar = ref(true);

        return {
            appbar
        };
    }
});
</script>
