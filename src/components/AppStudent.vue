<script lang="ts" setup>
// dependencies
import { AppContext ,Storage} from "@netless/window-manager";
import { computed, inject, onBeforeMount, onMounted, provide, ref, watchEffect } from "vue";
import {loginTeacher, checkTeacher} from "./Auth";
import {interfaces} from "./Types"

// Only QAInterface available for students

import QuestionAnswerInterface from "../interfaces/QuestionAnswerInterface.vue";


// app-wide context
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");



const current_interface = context.createStorage<{currentInterface: interfaces}>("interface");
provide<Storage<{currentInterface:interfaces}>>("interface",current_interface)
const current_interface_displayed = ref(current_interface.state.currentInterface);

const isTeacher = computed(()=>{loginTeacher(context);return checkTeacher(context)})
const startAnswering = ref(false)

console.debug('AppStudent.vue: isTeacher?',isTeacher.value)



onMounted(() =>{
  
  current_interface.addStateChangedListener(() => {
    current_interface_displayed.value = current_interface.state.currentInterface; // DK if it will work 
  })
});

watchEffect(() => {
  console.debug("AppStudent.vue: current_interface_displayed =",current_interface_displayed.value);
});

</script>

<template >
<QuestionAnswerInterface v-if="current_interface_displayed == interfaces.QuestionAnswerInterface"/>
<div v-else/>
</template>