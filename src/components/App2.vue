<script lang="ts" setup>
// dependencies
import { AppContext ,Storage} from "@netless/window-manager";
import { computed, inject, onBeforeMount, onMounted, provide, ref, watchEffect } from "vue";
import {loginTeacher, checkTeacher} from "./Auth";
import {interfaces} from "./Types"

// Only QAInterface availble for students

import QuestionAnswerInterface from "../interfaces/QuestionAnswerInterface.vue";
import EmptyInterface from "../interfaces/EmptyInterface.vue";
import { constant } from "lodash";

// app-wide context
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");



const current_interface = context.createStorage<{currentInterface: interfaces}>("interface");
provide<Storage<{currentInterface:interfaces}>>("interface",current_interface)
const current_interface_displayed = ref(interfaces.EmptyInterface);

const isTeacher = computed(()=>(loginTeacher(context) && checkTeacher(context)))

console.debug('App2.vue: isTeacher?',isTeacher.value)

onBeforeMount(()=>{

})

onMounted(() =>{
  current_interface.addStateChangedListener(() => {
    current_interface_displayed.value = current_interface.state.currentInterface; // DK if it will work 
  })
});

watchEffect(() => {
  console.debug("App2.vue: current_interface_displayed =",current_interface_displayed.value);
});
function consoleLog(s:number){console.log(s);}

</script>

<template v-if="!isTeacher">
<QuestionAnswerInterface v-if="current_interface_displayed == interfaces.QuestionAnswerInterface"/>
<div v-else/>
</template>