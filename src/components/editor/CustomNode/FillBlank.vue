<script lang="ts">

import { defineComponent, inject, ref } from 'vue';
import { useNodeCtx } from '@milkdown/vue';
import type { Node } from '@milkdown/prose/model';

export default defineComponent({
    name: 'FillBlankNodeVue',
});

</script>
<template>
<el-button id="multi-open-editor" @click="openEditor">填空题题</el-button>

<Teleport to="body" >
    <div v-show="editorShowed">
请编辑正确答案
        <el-button type="success" :icon="Check" @click="closeEditor" circle />
<el-input   v-model="currCorrectAnswer" placeholder="Please input" clearable/>
    </div>

</Teleport>
</template>

<script setup lang="ts">

import {Check,Delete,Plus,  Edit,  Message,  Search,  Star,} from '@element-plus/icons-vue'

const metadata = useNodeCtx<Node>();
const attrs = metadata.node.value.attrs;
console.log(attrs);
const currCorrectAnswer = ref((attrs.correctAnswer));

const editorShowed = ref(false);

const openEditor = ()=>{
  console.log(editorShowed.value)
  editorShowed.value = true;
  }

function closeEditor(){
  console.log('editing ended\nchoice:',attrs.choice,'\ncorrectAnswer:',attrs.correctAnswer);
  editorShowed.value = false;
}
</script>