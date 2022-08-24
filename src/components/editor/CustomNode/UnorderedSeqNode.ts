/** to edit an unorderedSequence */
import {createCmd, createCmdKey, createSlice, editorViewCtx, EditorViewReady, type MilkdownPlugin, type RemarkPlugin } from "@milkdown/core";
import { AtomList, createNode, type NodeCreator, type UnknownRecord } from "@milkdown/utils";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { InputRule } from "prosemirror-inputrules";
import type { Fragment, Node } from '@milkdown/prose/model';
import type { RenderVue } from "@milkdown/vue";

import directive from "remark-directive";

import "./style.css";
import { setBlockType } from "prosemirror-commands";
import { inject } from "vue";
import { type question,type answer,defaultTestUnorderedSequenceChoice,initAnswerBank, objectiveQuestionType } from "../../Types";
import { v1 } from "uuid";


export const id = "UnorderedSequenceNode";

const defaultObj = ()=>({ 
  identity:v1(),
  type:objectiveQuestionType[objectiveQuestionType.FillBlank],
  choice:{},
  correctAnswer:[],
 })

export const InsertUnorderedSequence = createCmdKey();




export const UnorderedSequenceNode:(view:ReturnType<RenderVue<Node>>)=>NodeCreator<string,UnknownRecord> = (view)=>createNode((utils,options) => ({
  id,
  schema: function(ctx) {
    // const editor = ctx.get(EditorSlice);
    // function toggleNeedShow(){
    //   // alert('test')
    //   editor.needShow = !(editor.needShow)
    //   console.debug(editor);
    //   // editor.Alert();
    // };
    return {
      id:id,
      attrs: {
        identity: {default:defaultObj().identity},
        type:{default:defaultObj().type},
        choice: { default: defaultObj().choice},
        correctAnswer: { default: defaultObj().correctAnswer},
      },
      content:'block+',
      group: "block",
      marks: "",
      atom: true,
      parseDOM: [
        {
          tag: `div.${id}`,
          getAttrs: (dom) => {
            if (!(dom instanceof HTMLElement)) {
              throw new Error();
            }
            return {
              identity:dom.dataset["identity"],
              type: dom.dataset["type"],
              choice:(dom.dataset["choice"]),
              correctAnswer:(dom.dataset["correctAnswer"]),
            };
          },
          // getContent: get HTMLContent
        }
      ],
      toDOM: (node) => {
        const button = document.createElement('div');
        button.classList.add(id);
        button.innerHTML = 'clickMe';
        
        return [
          'div',
          {
            class:id,
            'data-identity':node.attrs["identity"],
            'data-type': node.attrs["type"],
            'data-choice':(node.attrs["choice"]),
            'data-correctAnswer':(node.attrs["correctAnswer"]),
          },
          0
        ]
      },
      parseMarkdown: {
        match: (node) => {
          return node.type === "leafDirective" && node.name === id;
        },
        runner: (state, node, type) => {
          state.addNode(type, { 
            name: id,
            identity:node['identity'] as string,
            type: node['type'] as string,
            choice:JSON.parse(node['choice'] as string),
            correctAnswer:JSON.parse(node['correctAnswer'] as string),
          });
        }
      },
      toMarkdown: {
        match: (node) => node.type.name === id,
        runner: (state, node) => {
          state.addNode("leafDirective", undefined, undefined, {
            name: id,
            identity: node.attrs.identity,
            type: node.attrs.type,
            choice: JSON.stringify(node.attrs.choice),
            correctAnswer: JSON.stringify(node.attrs.correctAnswer),
          });
        }
      }
  }},
  inputRules: (nodeType) => [
    new InputRule(
      /%\{qa-unordered-seq\}/,
      (state, match, start, end) => {
        const [okay] = match;
        const { tr } = state;
        if (okay) {
          tr.replaceWith(start, end, nodeType.create(defaultObj()));
        }

        return tr;
      }
    )
  ],
  commands: (nodeType) => [createCmd(InsertUnorderedSequence, (ques_in) => (state, dispatch) => {
    if (!dispatch) return true;
    const { tr } = state;
    const node = nodeType.create(defaultObj());
    if (!node) {
        return true;
    }
    const _tr = tr.replaceSelectionWith(node);
    dispatch(_tr.scrollIntoView());
    return true;
})],

  remarkPlugins: () => [directive as RemarkPlugin],
  view:(ctx)=>{
    return view(ctx);
  }
}),
// [EditorSlice]
);


