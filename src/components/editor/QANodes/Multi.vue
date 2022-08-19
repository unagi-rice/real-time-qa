<template>
<el-radio-group id="props.answerContainer.id" @change="onChange">
    <el-radio v-for="(optionValue,optionKey) in props.answerContainer.choice"  :label="optionKey">{{optionValue}}</el-radio>
</el-radio-group>

</template>

<script setup lang="tsx">


import { defineEmits,defineProps } from 'vue';
import type { multiChoice,objectiveAnswerKeyType } from '../Types';

interface Props{
    answerContainer:multiChoice
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e:'contentChange',id:objectiveAnswerKeyType):void,
}>()

const onChange = (chosenOptionKey:objectiveAnswerKeyType)=>{emit('contentChange',chosenOptionKey);};

</script>