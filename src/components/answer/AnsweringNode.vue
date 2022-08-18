<template>
<div id="question-area">
<span>{{question.id}} {{question.content[0]}}</span>
</div>
<el-divider border-style="double" />
<h1 v-if="question.content[1].type == 'multi'">
<el-button 
  v-for="choice in choices">
{{choice}}
</el-button>
</h1>

<h1 v-if="question.content[1].type == 'unordered_seq'">

</h1>

<h1 v-if="question.content[1].type == 'unordered_seq'">

</h1>
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

const props = withDefaults(defineProps<Props>(), {
  question: () => defaultTestObjQuestion(), 
  preview: () => false
});


const emit = defineEmits<{
  (e:'made-response',response:any[]):void
}>()

const isPreview = props.preview;

onMounted(() => {
  console.debug("");
})



</script>

<style lang="scss">

</style>