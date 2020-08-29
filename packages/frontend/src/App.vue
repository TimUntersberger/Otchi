<template>
    <div id="q-app" style="height: 100vh">
        <q-layout container>
            <q-drawer
                v-model="globals.sidebar"
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
import { defineComponent, ref, reactive, provide, watch } from "@vue/composition-api";
import { Dark } from "quasar"

export default defineComponent({
    name: "App",
    setup() {
        const globals = reactive({
            sidebar: true,
            darkMode: localStorage.getItem("dark-mode") == "true"
        })
        
        Dark.set(globals.darkMode);

        watch(() => globals.darkMode, (prev) => {
            localStorage.setItem("dark-mode", String(globals.darkMode))
            Dark.set(globals.darkMode);
        })

        provide("globals", globals);

        return {
            globals
        };
    }
});
</script>
<style lang="scss">
body.body--dark {
    color: #f0f0f0 !important;
    background: #1D1D1D !important;
}
</style>