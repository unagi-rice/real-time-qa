<template>
<div id="question-area" />
<div id="answer-area"/>
</template>

<script setup lang="ts">
import { defineProps,defineEmits } from 'vue';
import {question as Question} from '../Types'

interface Props {
  question: Question // answerComponent in question shouldn't include correct answer
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e:'made-response',response:any[]):void
}>()

const isPreview = props.preview;



</script>

<style lang="scss">

</style>