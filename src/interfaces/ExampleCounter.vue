<script lang="ts" setup>
// dependencies
import type { AppContext } from "@netless/window-manager";
import { computed, inject, onMounted, ref, watchEffect } from "vue";
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");

const storage = context.createStorage("counter", { count: [] as number[] });
const real_count = ref(storage.state.count.length);

const count = computed<number>({
  get: () => real_count.value,
  set: (count_in:number) => storage.setState({ count:(storage.state.count as number[]).concat([count_in]) }),
});

onMounted(() =>
  storage.addStateChangedListener(() => {
    real_count.value = storage.state.count.length;
  })
);

watchEffect(() => {
  console.log("ExampleCounter.vue: count =", count.value);
});
</script>
<template>
  <button @click="count = 1">{{ count }}</button><br/>
  <button @click="storage.setState({ count:[114514] })">set to 114514</button>
</template>
