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
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api";
import { DEFAULT_API_SERVER_URL, setApiServerUrl } from "../lib/api";

export default defineComponent({
    setup() {
        const apiServerUrl = ref("");

        watch([apiServerUrl], () => {
            setApiServerUrl(apiServerUrl.value || DEFAULT_API_SERVER_URL);
        })

        return {
            apiServerUrl,
            DEFAULT_API_SERVER_URL
        };
    }
});
</script>

<style></style>
