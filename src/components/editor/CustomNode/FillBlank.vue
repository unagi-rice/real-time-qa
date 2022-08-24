<script lang="ts">

import { defineComponent, inject, ref } from 'vue';
import { useNodeCtx } from '@milkdown/vue';
import type { Node } from '@milkdown/prose/model';

export default defineComponent({
    name: 'FillBlankNodeVue',
});

</script>
<template>

  <el-button id="multi-open-editor" @click="openEditor">填空题</el-button>
<el-dialog v-model="editorShowed" :before-close="closeEditor" >
  <template #header>请编辑正确答案</template>
  <el-input   v-model="currCorrectAnswer" placeholder="Please input" clearable/>
</el-dialog>
</template>

<script setup lang="ts">

import {Check,Delete,Plus,  Edit,  Message,  Search,  Star,} from '@element-plus/icons-vue'

const metadata = useNodeCtx<Node>();
let attrs = structuredClone(metadata.node.value.attrs);
console.log(attrs);
const currCorrectAnswer = ref((attrs.correctAnswer));

const editorShowed = ref(false);
const outputText = ref('');

const openEditor = ()=>{
  console.log(editorShowed.value)
  editorShowed.value = true;
  }
function closeEditor(done:any){
  const {tr} = metadata.view.state
  console.log('editing ended\nchoice:',attrs.choice,'\ncorrectAnswer:',attrs.correctAnswer);
  metadata.view.dispatch(tr.setNodeMarkup(metadata.getPos(),metadata.node.value.type,attrs))
  done()
}
</script>