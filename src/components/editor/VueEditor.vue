<template>
  <VueEditor :editor="editor" />

</template>

<script setup lang="ts">
import { Teleport } from "vue";
import AnsweringNodeVue from "../answer/AnsweringNode.vue";
// core
import { VueEditor, useEditor } from "@milkdown/vue";
import { Editor, rootCtx, defaultValueCtx,editorViewOptionsCtx  } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { commonmark } from "@milkdown/preset-commonmark";
import { setBlockType } from '@milkdown/prose/commands';
import { TextSelection } from '@milkdown/prose/state';

// plugin
import { menu,Config as MenuConfig,defaultConfig, menuPlugin } from "@milkdown/plugin-menu";
import { history } from "@milkdown/plugin-history";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import AnsweringNode from "../answer/AnsweringNode.vue";
// import { emoji } from "@milkdown/plugin-emoji";
// import { slash } from "@milkdown/plugin-slash";
// import { prism } from "@milkdown/plugin-prism";
// import { tooltip } from "@milkdown/plugin-tooltip";
// import { indent } from "@milkdown/plugin-indent";
// import { trailing } from "@milkdown/plugin-trailing";
// import { upload } from "@milkdown/plugin-upload";
// import { cursor } from "@milkdown/plugin-cursor";
// import { clipboard } from "@milkdown/plugin-clipboard";

// import "prismjs/themes/prism.css";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>(); // TODO: output current content, input current content

let output = '';
let jsonOutput = {};
let readonly = false;
const editable = ()=>!readonly;



let commands:MenuConfig = defaultConfig;
commands.push([
  {
    type: 'select',
    text: '插入',
    options: [
      { id: '1', text: '单选题' },
      { id: '2', text: '填空题' },
      { id: '3', text: '主观题' },
      // { id: '0', text: 'Plain Text' },
    ],
    disabled: (view) => {
      const { state } = view;
      const nodeqa = state.schema.nodes['nodeqa']; // TODO: does nodeqa exists in editorState.schema.nodes
      if (!nodeqa) return true;
      const insertQANode = (type: number) => setBlockType(nodeqa, { type })(state);
      return (
        !(view.state.selection instanceof TextSelection) ||
        !(insertQANode(1) || insertQANode(2) || insertQANode(3))
      );
    },
    onSelect: (id) => (Number(id) ? ['TurnIntoHeading', Number(id)] : ['TurnIntoText', null]), // TODO: command ['commandName', argument]
  },
])

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
    // .use(emoji)
    // .use(slash)
    .use(commonmark)
    // .use(menu)
    .use(menu.configure(menuPlugin,{config:commands,}))
    .use(history)
    // .use(prism)
    // .use(tooltip)
    // .use(indent)
    // .use(trailing)
    // .use(upload)
    // .use(cursor)
    // .use(clipboard)
    .use(listener)
);
</script>
