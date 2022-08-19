<template>
<el-input  v-model="input" placeholder="Please input" @input="onInput" clearable/>

</template>

<script setup lang="tsx">
import { defineEmits,defineProps, ref } from 'vue';
import type { fillBlank } from '../Types';

interface Props{
    answerContainer:fillBlank
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e:'onChange',id:string):void,
}>()
const input = ref('')

const onInput = (inputValue:string)=>{emit('onChange',inputValue);}
</script>