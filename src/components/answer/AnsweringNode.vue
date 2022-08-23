<template>
<div id="question-area">
  <VueEditor mode="preview" /> <!--TODO:align with prop of vueEditor-->
<!--TODO: insert content-->
</div>

</template>


<script setup lang="ts">
import { defineProps,defineEmits, onMounted, inject} from 'vue';
import {question as Question, questionType as QuestionType, defaultTestObjQuestion, interfaces} from '../Types'
import { AppContext, Storage } from "@netless/window-manager";

const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage =
  inject<Storage<{ currentInterface: interfaces }>>("interface");
if (!interfaceStorage)
  throw new Error("must call provide('interface') before mount App");

interface Props {
  question: Question // answerComponent in question shouldn't include correct answer
  preview: Boolean
}

const props = defineProps<Props>()


const isPreview = props.preview;

onMounted(() => {
  console.debug("");
})



</script>

<style lang="scss">

</style>