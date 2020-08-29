<template>
    <div class="q-pa-xl">
        <label>API Server</label>
        <q-input
            borderless
            filled
            v-model="apiServerUrl"
            :placeholder="DEFAULT_API_SERVER_URL"
            dense
        ></q-input>
        <label>Dark mode</label>
        <q-toggle v-model="globals.darkMode"></q-toggle>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject } from "@vue/composition-api";
import { DEFAULT_API_SERVER_URL, setApiServerUrl } from "../lib/api";

export default defineComponent({
    setup() {
        const globals = inject<any>("globals");
        const apiServerUrl = ref("");

        watch([apiServerUrl], () => {
            setApiServerUrl(apiServerUrl.value || DEFAULT_API_SERVER_URL);
        })

        return {
            apiServerUrl,
            globals,
            DEFAULT_API_SERVER_URL
        };
    }
});
</script>

<style></style>
