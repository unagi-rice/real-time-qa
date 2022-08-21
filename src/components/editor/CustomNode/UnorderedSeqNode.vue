<script lang="ts">

import { defineComponent, inject} from 'vue';
import { computed } from 'vue';
import { forceUpdate } from '@milkdown/utils';

export default defineComponent({
  name: 'MultiVue',
});

</script>

<template>
<el-button id="multi-open-editor" @click="openEditor">多选题</el-button>
<Teleport to="body" >
  <el-card id="answerContainer-editor multi-editor" v-if="editorShowed" >
    <el-button type="success" :icon="Check" @click="closeEditor" circle />
    <span>请编辑题目</span>
    <el-checkbox-group :id="attrs.identity" v-model="currCorrectAnswer" >
    <el-space direction="vertical">

      <el-checkbox class="" v-for="(_,optionKey) in currChoice"  :label="optionKey" :key="optionKey">
        <el-input v-model="currChoice[optionKey]" clearable/>
        <el-button @click.once="deleteOption(String(optionKey))" type="danger" :data-key="optionKey" :icon="Delete" shadow="hover" color="#ffffff"  />
      </el-checkbox>
    <el-button :icon="Plus" @click="addOption" v-show="totalChoice.length > 0"></el-button>
    </el-space>
</el-checkbox-group>
</el-card>
</Teleport>

</template>

<script setup lang="ts">

import {Check,Delete,Plus,  Edit,  Message,  Search,  Star,} from '@element-plus/icons-vue'
import { nodeMetadata, useNodeCtx, type EditorInfo } from '@milkdown/vue';
import type { Node } from '@milkdown/prose/model';
import { defineEmits,defineProps, ref } from 'vue';
import type { multiChoice,objectiveAnswerKeyType } from '../../Types';

import "./style.css"

const metadata = useNodeCtx<Node>();
const attrs = metadata.node.value.attrs;
console.log(attrs);
const currChoice = ref((attrs.choice));
const currCorrectAnswer = ref((attrs.correctAnswer));

const editorShowed = ref(false);

const openEditor = ()=>{
  console.log(editorShowed.value)
  editorShowed.value = true;
  }
// const onChange = (chosenOptionKey:objectiveAnswerKeyType)=>{currCorrectAnswer.value = chosenOptionKey};

let totalChoice = ['a','b','c','d','e','f','g','h'];

const maxChoice = computed(()=>Object.keys(attrs.choice).length);

function addOption(){
  
  // console.log('before:',totalChoice.length)
  attrs.choice[totalChoice[0]] = '';
  totalChoice.splice(0,1);
  console.log(attrs.choice)
  // console.log('after',totalChoice.length)
}

function closeEditor(){
  console.log('editing ended\nchoice:',attrs.choice,'\ncorrectAnswer:',attrs.correctAnswer);
  editorShowed.value = false;
  // force refresh markdowncts
  const editor = inject<EditorInfo>('editor');
  if(editor)editor.action(forceUpdate());
}

function deleteOption(optKey:string){
  if(Object.keys(attrs.choice).includes((optKey))){
    delete attrs.choice[optKey];
    totalChoice.push(optKey)
    console.log(attrs.choice)
  }
  else{
    console.log(optKey,'not found')
  }
}
</script>
<style scoped>
#multi-open-editor{
  width:10rem;
}
#multi-editor{
  width:80%;
  left:10%;
}
</style>