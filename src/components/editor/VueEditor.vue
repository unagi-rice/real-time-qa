<template>
  <button @click="consoleLog">output</button>
  <button @click="toggleReadOnly">toggle readable</button>
  <VueEditor :editor="editor" @togglePreview="togglePreview"/>
  <Teleport id="question-editor" v-if="showAnswerEditor" to="body">
    <Multi id="Multi-editor" class="answerContainer-editor" :answer-container="multiProp" @contentChange="onMultiUpdate"/>
    <FillAnswer id="FillBlank-editor" class="answerContainer-editor" :answer-container="fillProp" @contentChange="onFillUpdate"/>
    <div id="FillBlank-editor" class="answerContainer-editor"/>
    
  </Teleport>
  <div v-if="showPreview" style="width:50px;height:50px;border-style:solid;border-width:2px;">show if true</div>
</template>

<script setup lang="ts">
import { h,inject,defineComponent,ref, provide} from "vue";

// core
import { VueEditor, useEditor ,type RenderVue} from "@milkdown/vue";
import { Editor, rootCtx, defaultValueCtx,editorViewOptionsCtx, type MilkdownPlugin  } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { commonmark, paragraph } from "@milkdown/preset-commonmark";
import { setBlockType } from '@milkdown/prose/commands';
import { TextSelection } from '@milkdown/prose/state';
// plugin
import { emoji } from "@milkdown/plugin-emoji";
import { menu,type Config as MenuConfig,defaultConfig, menuPlugin  } from "@milkdown/plugin-menu";
import { slash } from "@milkdown/plugin-slash";
import { history } from "@milkdown/plugin-history";
import { prism } from "@milkdown/plugin-prism";
import { tooltip } from "@milkdown/plugin-tooltip";
import { indent } from "@milkdown/plugin-indent";
import { trailing } from "@milkdown/plugin-trailing";
import { upload } from "@milkdown/plugin-upload";
import { cursor } from "@milkdown/plugin-cursor";
import { clipboard } from "@milkdown/plugin-clipboard";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import {diagram} from "@milkdown/plugin-diagram"
import { block } from "@milkdown/plugin-block";   
import { codeFence } from "@milkdown/preset-commonmark";// for qa node
import type { Node } from '@milkdown/prose/model';
// import {QANode} from './QANode'
import { AtomList } from '@milkdown/utils';
// import {iframe} from './ExampleIframe'
// import {iframe2} from './ExampleIframe copy'
import {QANode, InsertSmth,QANodeCommandPlugin} from './CustomNode'
import QANodeVue from './CustomNode/QANode.vue'
import "prismjs/themes/prism.css";
import { fillBlank, objectiveQuestionType, type objectiveAnswerContainer, type question, type subjectiveAnswerContainer } from "./Types";


import Multi from "./QANodes/Multi.vue";
import FillAnswer from "./QANodes/FillAnswer.vue";
import { multiChoice } from "./Types";

const props = defineProps<{
  modelValue: question;
}>();

const emit = defineEmits<{
  (e: "update", value: string): void;
}>();





let commands:MenuConfig = (defaultConfig);
// TESTED: valid 
console.log(commands)
commands[0].push(

  {
    type: 'select',
    text: '插入',
    options: [
      { id: '1', text: '单选题' },
      { id: '2', text: '填空题' },
      { id: '3', text: '主观题' },
    ],
    // TODO: close selector after choose
    // behaviour when this menu is disabled
    disabled: (view) => { 
      const { state } = view;
      const nodeqa = state.schema.nodes['QANode'];
      console.debug(nodeqa);
      if (!nodeqa) return true;
      const insertQANode = (type: number) => setBlockType(nodeqa, { type })(state);
      return (
        !(view.state.selection instanceof TextSelection) ||
        !(insertQANode(1) || insertQANode(2) || insertQANode(3))
      );
    },
    onSelect: (id) => (Number(id) === 1?[InsertSmth,1]:['TurnIntoHeading', Number(id)]), // TODO: (real-time-qa)match insertQANode 
  },
)

const showPreview = ref(true);
provide('showPreview',showPreview);
const togglePreview = () => {
    showPreview.value = !showPreview.value;
    console.debug(showPreview.value);
};
const showAnswerEditor = ref(true);
provide('showAnswerEditor',showAnswerEditor);
const toggleAnswershowAnswerEditor = () => {
    showAnswerEditor.value = !showAnswerEditor.value;
    console.debug(showAnswerEditor.value);
};
const multiProp = ref(new multiChoice());
const fillProp = ref(new fillBlank());

function toMarkdown(contentIn:(string | objectiveAnswerContainer | subjectiveAnswerContainer<string>)[])
{
  let resultMarkdown = '';
  for(let part in contentIn){
    if (typeof(part) === 'string')
    {
      resultMarkdown += part;
    }
    else if ((part as objectiveAnswerContainer | subjectiveAnswerContainer<string>).type === objectiveQuestionType[objectiveQuestionType.Multi])
    {
      let partMulti = part as multiChoice;
      resultMarkdown += `
\`\`\`qa-multi
id:${partMulti.id}
choice:\n`
      for(let key in partMulti.choice){
        let value = partMulti.choice[key];
        resultMarkdown += `${key} : ${value}\n`
      }
      resultMarkdown += ``
    }
  }
}


// listen to change of inputted value, change modelDefaultValue
/**
 * @params event
 * @params question
 */
function onModelValueChange()
{
  // change string of question
  
  // 
}

let output = '';
let jsonOutput = {};
let readonly = false;
const editable = ()=>!readonly;
const { editor } = useEditor((root,renderVue) =>{
  const iframePlugin = AtomList.create([
    QANode(renderVue<Node>(QANodeVue))(),
    ]);
  return Editor.make()
    .config((ctx) => {
      // rootCtx: Save the root dom that milkdown should load on.
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, toMarkdown(props.modelValue.content));// set dafault value of editor when loaded
      ctx.set(editorViewOptionsCtx, { editable });
      // set listeners
      // ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
      //   emit("update:modelValue", markdown);
      // });
    })
    .config((ctx) => {
        // markdown string listener
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
            output = markdown;
            // console.log('output changed to',output)
        })
        .updated((ctx, doc, prevDoc) => {
          jsonOutput = doc.toJSON();
        })
        .beforeMount((ctx)=>{
          output = props.modelValue; // TODO: load question
          // jsonOutput = doc.toJSON(); 
          console.log('output initialized to',output)
        })

    })
    .use(nord)
    .use(emoji)
    .use(slash)// slash command
    .use(commonmark)
    // .use(menu)
    .use(history)
    .use(prism) // code block
    .use(tooltip)
    .use(indent)
    .use(trailing)
    .use(upload)
    .use(cursor)
    .use(clipboard)
    .use(diagram)
    .use(listener)
    // .use(qanode)
    .use(QANodeCommandPlugin)
    .use(iframePlugin)
    .use(menu.configure(menuPlugin,{config:commands,}))
});

console.info('editor:',editor)
function consoleLog(){
  console.log('jsonOutput =',jsonOutput)
  alert('showPreview = '+showPreview.value.toString())
}

function toggleReadOnly(){
  readonly = !readonly;
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
