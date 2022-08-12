<template>
  <button @click="consoleLog">output</button>
  <button @click="toggleReadOnly">toggle readable</button>
  <VueEditor :editor="editor" />
</template>

<script setup lang="ts">
import { h,inject,defineComponent} from "vue";

// core
import { VueEditor, useEditor } from "@milkdown/vue";
import { Editor, rootCtx, defaultValueCtx,editorViewOptionsCtx  } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { commonmark } from "@milkdown/preset-commonmark";

// plugin
import { emoji } from "@milkdown/plugin-emoji";
import { menu } from "@milkdown/plugin-menu";
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

import { codeFence } from "@milkdown/preset-commonmark";// for qa node

import "prismjs/themes/prism.css";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update", value: string): void;
}>();





let output = '';
let jsonOutput = {};
let readonly = false;
const editable = ()=>!readonly;
const { editor } = useEditor((root) =>
  Editor.make()
    .config((ctx) => {
      // rootCtx: Save the root dom that milkdown should load on.
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, props.modelValue);// set dafault value of editor when loaded
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
          output = props.modelValue;
          // jsonOutput = doc.toJSON(); 
          console.log('output initialized to',output)
        })

    })
    .use(nord)
    .use(emoji)
    .use(slash)// slash command
    .use(commonmark)
    .use(menu)
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
);

console.info('editor:',editor)
function consoleLog(){
  console.log('jsonOutput =',jsonOutput)
}

function toggleReadOnly(){
  readonly = !readonly;
}

</script>
