<script lang="ts">

import { defineComponent, inject, ref } from 'vue';
import { useNodeCtx } from '@milkdown/vue';
import type { Node } from '@milkdown/prose/model';

export default defineComponent({
    name: 'FillBlankNodeVue',
});

</script>
<template>

  <el-button id="multi-open-editor" v-if="props.mode === 'edit'" @click="openEditor">填空题题</el-button>
  <el-input v-else v-model="outputText" placeholder="Please input"/>
<el-dialog v-show="editorShowed">
  <template #header>请编辑正确答案</template>
  <el-input   v-model="currCorrectAnswer" placeholder="Please input" clearable/>
  <template #footer><el-button type="success" :icon="Check" @click="closeEditor" circle /></template>
</el-dialog>
</template>

<script setup lang="ts">

import {Check,Delete,Plus,  Edit,  Message,  Search,  Star,} from '@element-plus/icons-vue'

const metadata = useNodeCtx<Node>();
const attrs = metadata.node.value.attrs;
console.log(attrs);
const currCorrectAnswer = ref((attrs.correctAnswer));

const editorShowed = ref(false);
const outputText = ref('');

const openEditor = ()=>{
  console.log(editorShowed.value)
  editorShowed.value = true;
  }

function closeEditor(){
  console.log('editing ended\nchoice:',attrs.choice,'\ncorrectAnswer:',attrs.correctAnswer);
  editorShowed.value = false;
}
</script>