<script lang="ts">

import { defineComponent, inject} from 'vue';
import { computed } from 'vue';
import { forceUpdate, getMarkdown, insert, setAttr } from '@milkdown/utils';

export default defineComponent({
  name: 'MultiVue',
});

</script>


<template>
<el-button id="multi-open-editor" @click="openEditor">单选题</el-button>
<el-dialog v-model="editorShowed" title="请编辑" width="30%"
    :before-close="closeEditor" >
  <el-card id="answerContainer-editor multi-editor" v-if="editorShowed" >
    <template #header>请编辑选项</template>
    <el-radio-group :id="attrs.identity" v-model="currCorrectAnswer" >
    <el-space direction="vertical">

      <el-radio class="" v-for="(_,optionKey) in currChoice"  :label="optionKey" :key="optionKey">
        <el-input v-model="currChoice[optionKey]" clearable/>
        <el-button @click.once="deleteOption(String(optionKey))" type="danger" :data-key="optionKey" :icon="Delete" shadow="hover" color="#ffffff"  />
      </el-radio>
    <el-button :icon="Plus" @click="addOption" v-show="totalChoice.length > 0"></el-button>
    </el-space>
</el-radio-group>
</el-card>
</el-dialog>

</template>

<script setup lang="ts">

import {Check,Delete,Plus,  Edit,  Message,  Search,  Star,} from '@element-plus/icons-vue'
import { nodeMetadata, useNodeCtx, type EditorInfo } from '@milkdown/vue';
import type { Attrs, Node } from '@milkdown/prose/model';
import { defineEmits,defineProps, ref } from 'vue';
import type { multiChoice,objectiveAnswerKeyType } from '../../Types';

import "./style.css"

const metadata = useNodeCtx<Node>();
let attrs = structuredClone(metadata.node.value.attrs);
console.log(attrs);
const currChoice = ref((attrs.choice));
const currCorrectAnswer = ref((attrs.correctAnswer));

const editorShowed = ref(false);
const editor = inject<EditorInfo>('editor')

const openEditor = ()=>{
  console.log(editorShowed.value)
  editorShowed.value = true;
  }
// const onChange = (chosenOptionKey:objectiveAnswerKeyType)=>{currCorrectAnswer.value = chosenOptionKey};

let totalChoice = ['a','b','c','d','e'];

const maxChoice = computed(()=>Object.keys(attrs.choice).length);

function addOption(){
  
  // console.log('before:',totalChoice.length)
  attrs.choice[totalChoice[0]] = '';
  totalChoice.splice(0,1);
  console.debug(attrs.choice)
  // console.log('after',totalChoice.length)
}
// if editor is not editable, show ansewering 

function closeEditor(done:any){
  const {tr} = metadata.view.state
  metadata.view.dispatch(tr.setNodeMarkup(metadata.getPos(),metadata.node.value.type,attrs))
  done()
}

function deleteOption(optKey:string){
  if(Object.keys(attrs.choice).includes((optKey))){
    delete attrs.choice[optKey];
    totalChoice.push(optKey)
    console.debug(attrs.choice)
  }
  else{
    console.debug(optKey,'not found')
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