<script lang="ts" setup>
// dependencies
import { AppContext ,Storage} from "@netless/window-manager";
import { computed, inject, onBeforeMount, onMounted, provide, ref, watchEffect } from "vue";
import {loginTeacher, checkTeacher} from "./Auth";
import {interfaces} from "./Types"

// interfaces
import EmptyInterface from "../interfaces/EmptyInterface.vue";
import ExampleCounter from "../interfaces/ExampleCounter.vue";
import StatsInterface from "../interfaces/StatsInterface.vue";


// app-wide context
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const $globVar = ref({})

const current_interface = context.createStorage("interface",{currentInterface:interfaces.EmptyInterface});
provide<Storage<{currentInterface:interfaces}>>("interface",current_interface)
const current_interface_displayed = ref(interfaces.MainInterface);


const isTeacher = computed(()=>(loginTeacher(context) && checkTeacher(context)))

console.debug('App.vue: isTeacher?',isTeacher.value)

onBeforeMount(()=>{
  
})

onMounted(() =>{
  current_interface.addStateChangedListener(() => {
    current_interface_displayed.value = current_interface.state.currentInterface;
  })
});

watchEffect(() => {
  console.debug("App.vue: current_interface_displayed =",current_interface_displayed.value);
});
function consoleLog(s:number){console.log(s);}

</script>
<template v-if="isTeacher">
<!-- NOTICE: list out interfaces and their props, emitters -->
<MainInterface v-if="current_interface_displayed == interfaces.MainInterface"/>
<EmptyInterface v-if="current_interface_displayed == interfaces.EmptyInterface" @console-log="consoleLog"/>
<ExampleCounter v-if="current_interface_displayed == interfaces.ExampleCounter"/>
<StatsInterface v-if="current_interface_displayed == interfaces.StatsInterface"/>
<IndividualStatsInterface v-if="current_interface_displayed == interfaces.IndividualStatsInterface"/>
</template>
