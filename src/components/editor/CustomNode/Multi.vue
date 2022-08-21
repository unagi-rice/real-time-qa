<script lang="ts">

import { defineComponent, inject} from 'vue';
import { computed } from 'vue';
import { forceUpdate, getMarkdown, insert, setAttr } from '@milkdown/utils';

export default defineComponent({
  name: 'MultiVue',
});

</script>
<!-- 
<template>
  <el-button text @click="dialogVisible = true"
    >click to open the Dialog</el-button
  >

  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="30%"
    :before-close="handleClose"
  >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>



 -->

<template>
<el-button id="multi-open-editor" @click="openEditor">单选题</el-button>
<Teleport to="body" >
  <el-card id="answerContainer-editor multi-editor" v-if="editorShowed" >
    <el-button type="success" :icon="Check" @click="closeEditor" circle />
    <span>请编辑题目</span><br/>
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
</Teleport>

</template>

<script setup lang="ts">

import {Check,Delete,Plus,  Edit,  Message,  Search,  Star,} from '@element-plus/icons-vue'
import { nodeMetadata, useNodeCtx, type EditorInfo } from '@milkdown/vue';
import type { Attrs, Node } from '@milkdown/prose/model';
import { defineEmits,defineProps, ref } from 'vue';
import type { multiChoice,objectiveAnswerKeyType } from '../../Types';

import "./style.css"

const metadata = useNodeCtx<Node>();
const attrs = metadata.node.value.attrs;
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

function closeEditor(e:Event){
  console.log('editing ended\nchoice:',attrs.choice,'\ncorrectAnswer:',attrs.correctAnswer);
  // force refresh markdown
  editor?.editor.value?.action(()=>{
    console.debug('refreshed editor');
    return forceUpdate()});
      const view = metadata.view;
    const node = metadata.node;
    const getPos = metadata.getPos;
    console.log('getPos():',getPos());
//    editor?.editor.value?.action(setAttr(getPos(),(prevAttrs:Attrs)=>{
//     console.log(prevAttrs);
//   let newChoice = structuredClone(currChoice.value)
//     console.log({
//   identity:prevAttrs.identity,
//   type:prevAttrs.type,
//   choice:newChoice,
//   correctAnswer:currCorrectAnswer.value,
//   })
//     return {
//   identity:prevAttrs.identity,
//   type:prevAttrs.type,
//   choice:newChoice,
//   correctAnswer:currCorrectAnswer.value,
//   }
// }))

  editorShowed.value = false;
  // BUG: markdown not updated after closing editor
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