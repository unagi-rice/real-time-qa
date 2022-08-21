
<!-- 
editable:
  true: editing
  false: preview / answering 

 -->
<template>
  <button @click="consoleLog">output</button>
  <button @click="toggleReadOnly">toggle readable</button>
  <button @click="updateEditor">update</button>
  <button @click="setEditor">set</button>
  <VueEditor :editor="editor" />
  
  <!-- </Teleport> -->
  <!-- <div v-if="showPreview" style="width:50px;height:50px;border-style:solid;border-width:2px;">show if true</div> -->
</template>

<script setup lang="ts">
import { h,inject,defineComponent,ref, provide, watch} from "vue";

// core
import { VueEditor, useEditor ,type RenderVue} from "@milkdown/vue";
import { Editor, rootCtx, defaultValueCtx,editorViewOptionsCtx, type MilkdownPlugin  } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { commonmark, paragraph } from "@milkdown/preset-commonmark";
import { setBlockType } from '@milkdown/prose/commands';
import { TextSelection } from '@milkdown/prose/state';
// plugin
import { menu,type Config as MenuConfig,defaultConfig, menuPlugin  } from "@milkdown/plugin-menu";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { block } from "@milkdown/plugin-block";   
import { codeFence } from "@milkdown/preset-commonmark";// for qa node
import type { Node } from '@milkdown/prose/model';
import { AtomList, forceUpdate, insert } from '@milkdown/utils';
import "prismjs/themes/prism.css";
import { answer, fillBlank, objectiveQuestionType, type objectiveAnswerContainer, type question, type subjectiveAnswerContainer } from "../Types";

import { MultiNode,UnorderedSequenceNode,FillBlankNode,FreeResponseNode } from "./CustomNode";
import {InsertMulti,InsertUnorderedSequence,InsertFillBlank,InsertFreeResponse} from "./CustomNode"
import MultiVue from "./CustomNode/Multi.vue";
import FillBlankNodeVue from "./CustomNode/FillBlank.vue";
import UnorderedSequenceVue from "./CustomNode/UnorderedSeqNode.vue";

import { history } from "@milkdown/plugin-history";
import { indent } from "@milkdown/plugin-indent";
import { clipboard } from "@milkdown/plugin-clipboard";
import { tooltip } from "@milkdown/plugin-tooltip";

const props = defineProps<{
  mode:"edit"|"preview"|"answer"
  question:question 
  answer?:answer
}>();

const emit = defineEmits<{
  (e: "update", question: question,answer:answer): void;
  (e: "answered", answer:answer):void
}>();





let commands:MenuConfig = (defaultConfig);
commands[0].push(
  {
    type: 'select',
    text: '插入',
    options: [
      { id: '1', text: '单选题' },
      { id: '2', text: '多选题' },
      { id: '3', text: '填空题' },
      { id: '4', text: '主观题' },
    ],
    onSelect: (id) => {
      if(id === '1')return [InsertMulti]
      else if (id === '2')
        return [InsertUnorderedSequence]
      else if (id === '3')
        return [InsertFillBlank]
      else // else if (id === '4')
        return [InsertFreeResponse]
    }, 
  },
)

function updateEditor(){
  editor?.editor.value?.action(forceUpdate())
}


let output = '';
let jsonOutput = {};
let readonly = false;
const editable = ()=>!readonly;
const { editor } = useEditor((root,renderVue) =>{
  const customNodes:AtomList = AtomList.create([
    MultiNode(renderVue<Node>(MultiVue))(),
    FillBlankNode(renderVue<Node>(FillBlankNodeVue))(),
    UnorderedSequenceNode(renderVue<Node>(UnorderedSequenceVue))(),
    FreeResponseNode(),
    ]);
  return Editor.make()
    .config((ctx) => {
      // rootCtx: Save the root dom that milkdown should load on.
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, );// TODO: set dafault value of editor when loaded
      ctx.set(editorViewOptionsCtx, { editable });
      // });
    })
    .config((ctx) => {
        // markdown string listener
        ctx.get(listenerCtx)
        .markdownUpdated((ctx, markdown, prevMarkdown) => {
            output = markdown;// BUG: not updated after editting node
            // console.log('output changed to',output)
        })
        .updated((ctx, doc, prevDoc) => {
          jsonOutput = doc.toJSON();
          console.log(doc.textContent)
        })
        .beforeMount((ctx)=>{
           // TODO: load question
          console.log('output initialized to',output)
        })

    })
    .use(nord)
    .use(commonmark)
    // .use(menu)
    .use(history)
    .use(tooltip)
    .use(indent)
    .use(clipboard)
    .use(listener)
    .use(customNodes)
    .use(menu.configure(menuPlugin,{config:commands,}))
});



provide('editor',editor);

// console.info('editor:',editor)
function consoleLog(){
  console.log('jsonOutput =',jsonOutput)
  console.log('showPreview = ',output)
}

function toggleReadOnly(){
  readonly = !readonly;
  editor.editor.value?.action(forceUpdate());
}
function setEditor(){
  editor.editor.value?.action(insert('\nresetted'))
}
</script>

<style scoped>
.answerContainer-editor{
  width:50%;
  height:50%;
  top:25%;
  left:25%;
}


</style>
