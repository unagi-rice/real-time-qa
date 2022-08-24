<template>
  <el-button @click="openPreview">预览</el-button>
  <VueEditor :editor="editor" />
  <el-dialog v-model="dialogPreviewVisible" title="预览">
    <div v-for="(c, index) in currQuestion.content">
        <span v-if="typeof (c) == 'string'" v-html="micromark(c)"/>
        <el-input v-else-if="c.type === 'FillBlank'" placeholder="输入你的答案" />
        <div v-else-if="c.type === 'Multi'">
          <!-- <span>MultiChoice</span> -->
          <el-radio-group type="vertical">
            <div v-for="(cc, cidx) in (c as multiChoice).choice">
              <el-radio :label=cidx border>{{ cc }}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <div v-else-if="c.type === 'UnorderedSequence'">
          <el-checkbox-group>
              <div v-for="(cc, cidx) in (c as unorderedSequenceChoice).choice">
                <el-checkbox :label=cidx border>
                  {{ cc }}
                </el-checkbox>
              </div>
          </el-checkbox-group>
        </div>
    </div>
  </el-dialog>
  
</template>

<script setup lang="ts">
import { h,inject,ref, provide, watch, watchEffect} from "vue";
import { answer, type question,type multiChoice,type unorderedSequenceChoice} from "../Types";
import { micromark } from "micromark";

// core
import { VueEditor, useEditor ,type RenderVue} from "@milkdown/vue";
import { Editor, rootCtx, defaultValueCtx,editorViewOptionsCtx, type MilkdownPlugin  } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { commonmark,  } from "@milkdown/preset-commonmark";
// Milkdown plugin
import { menu,type Config as MenuConfig,defaultConfig, menuPlugin  } from "@milkdown/plugin-menu";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { block } from "@milkdown/plugin-block";   
import type { Node } from '@milkdown/prose/model';
import { AtomList, forceUpdate, insert } from '@milkdown/utils';
import { history } from "@milkdown/plugin-history";
import { indent } from "@milkdown/plugin-indent";
import { clipboard } from "@milkdown/plugin-clipboard";
import { tooltip } from "@milkdown/plugin-tooltip";

// custom markdown node
import { MultiNode,UnorderedSequenceNode,FillBlankNode,FreeResponseNode } from "./CustomNode";
import {InsertMulti,InsertUnorderedSequence,InsertFillBlank,InsertFreeResponse} from "./CustomNode"
import MultiVue from "./CustomNode/Multi.vue";
import FillBlankNodeVue from "./CustomNode/FillBlank.vue";
import UnorderedSequenceVue from "./CustomNode/UnorderedSeqNode.vue";
import { Markdown2QuestionAnswer, questionAnswer2Markdown } from "./MarkdownUtils";

interface Props{
  question?:question 
  answer?:answer
}

const props = withDefaults(defineProps<Props>(),{
  question:()=>({id:'',content:[]}),
  answer:()=>({id:'',content:{}}),
});

const emit =  defineEmits<{
  (e: "update", question: question,answer:answer): void
}>();

const currQuestion = ref<question>({id:'',content:[]}) // TEST-ITEM: ensure not to show when no question is selected
const currAnswer = ref<answer>({id:'',content:{}}) 


// reactive controlling variable
const dialogPreviewVisible = ref(false)
const currEditorValue = ref('')

const openPreview = ()=>{dialogPreviewVisible.value = true;}


watch(()=>props.question.id,()=>{
  currEditorValue.value = questionAnswer2Markdown(props.question,props.answer)
})



// setting up editor
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
      ctx.set(defaultValueCtx, currEditorValue.value);
      ctx.set(editorViewOptionsCtx, { editable });
      // });
    })
    .config((ctx) => {
        // markdown string listener
        ctx.get(listenerCtx)
        .markdownUpdated((ctx, markdown, prevMarkdown) => {
            output = markdown;// TEST-ITEM: if updated after editting node
            // console.log('output changed to',output)
        })
        .updated((ctx, doc, prevDoc) => {
          jsonOutput = doc.toJSON();
          console.log(doc.textContent)
        })
        .beforeMount((ctx)=>{
          console.log('output initialized to',output)
          currAnswer.value = props.answer;
          currQuestion.value = props.question;
          console.debug('check props',props.question.id,',',props.answer.id)
        })
        .destroy((ctx) => {
                // when editor loses focus
                            let qa = Markdown2QuestionAnswer(output)
                currQuestion.value = qa.question;
                currAnswer.value = qa.answer;
                console.log('editor destroyed',currQuestion.value,currAnswer.value)
                emit('update',currQuestion.value,currAnswer.value)


            })
    })
    .use(nord)
    .use(commonmark)
    // .use(block)
    .use(history)
    // .use(tooltip)
    // .use(indent)
    .use(clipboard)
    .use(listener)
    .use(customNodes)
    .use(menu.configure(menuPlugin,{config:commands,}))
});
provide('editor',editor);




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
  height:50%;
  top:25%;
}


</style>
