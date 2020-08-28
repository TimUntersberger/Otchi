<template>
    <q-table
        flat
        square
        hide-header
        hide-bottom
        dense
        separator="none"
        :title="title"
        :data="items"
    >
        <template v-slot:body="props">
            <q-tr
                :props="props"
                class="cursor-pointer"
                @click="$emit('click', props.row)"
            >
                <q-td :props="props" key="cover">
                    <q-img
                        style="min-width: 40px; max-width: 80px;"
                        :src="props.row.cover"
                        :ratio="4 / 5"
                    ></q-img>
                </q-td>
                <q-td :props="props" key="title">
                    {{ props.row.title }}
                </q-td>
                <q-td :props="props" key="progress">
                    {{ props.row.progress }}
                </q-td>
            </q-tr>
        </template>
    </q-table>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
    props: {
        items: {
            type: Array,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    }
});
</script>

<style></style>
