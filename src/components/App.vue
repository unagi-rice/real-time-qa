<script lang="ts" setup>
// dependencies
import type { AppContext } from "@netless/window-manager";
import { computed, inject, onMounted, ref, watchEffect } from "vue";
import {login} from "./Auth";
import InterfaceBase from "./InterfaceBase.vue";

// interfaces
import * as EmptyInterface from "./EmptyInterface.vue";
const refchild= ref(EmptyInterface)
console.log('app.vue:refchild=',refchild.value);
const interfaces = [
  
  EmptyInterface,
]
// to store template ref of interface
var curr_interface_i:number = 0
const curr_interface = ref(typeof interfaces[curr_interface_i])

const interfaceRef = ref<InstanceType<curr_interface.value> | null>(null)

// to store template ref of 
// TODO:referencing properties

const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const isTeacher = computed(()=>(login(context)))
console.log('isTeacher?',isTeacher)

const storage = context.createStorage("counter", { count: 0 });
const real_count = ref(storage.state.count);

const count = computed<number>({
  get: () => real_count.value,
  set: (count) => storage.setState({ count }),
});

onMounted(() =>{
  curr_interface_i = 0;
  storage.addStateChangedListener(() => {
    // real_count.value = storage.state.count;
  })
});

watchEffect(() => {
  console.log('app.vue:interface=',  interfaceRef.value);
  console.log('app.vue:title=',
  interfaceRef.value?.title);
  console.log('app.vue:tag=',interfaceRef.value?.tag);
  console.log("App.vue: count =", count.value);
});

// TODO: prerendered pages

</script>
<template>
  <!-- <InterfaceBase v-if="isTeacher" :title="'title'" :interface_tag="'hi'" :buttons=""> -->
  <InterfaceBase v-if="isTeacher"  :title="interfaceRef.value?.title" :interface_tag="interfaceRef.value?.tag">
    <!-- <component :is="curr_interface.value" ref="interfaceRef" /> -->
    <h1>HI</h1>
  </InterfaceBase>
  <span v-else>No interface loaded<br/>isTeacher?{{isTeacher}}</span>
</template>
 