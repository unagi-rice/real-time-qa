/** to edit an multiChoice */
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
import { type question,type answer,defaultTestMultiChoice,initAnswerBank, objectiveQuestionType } from "../../Types";
import { v1 } from "uuid";

// TODO: question types

export const id = "MultiNode";
// TODO: correctAnswer
const defaultObj = ()=>({ 
  identity:v1(),
  type:objectiveQuestionType[objectiveQuestionType.Multi],
  choice:{},
  correctAnswer:'',
 })

export const InsertMulti = createCmdKey();





export const MultiNode:(view:ReturnType<RenderVue<Node>>)=>NodeCreator<string,UnknownRecord> = (view)=>createNode((utils,options) => ({
  id,
  schema: function(ctx) {
    return {
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
      isolating:true,
      parseDOM: [
        {
          tag: `div.${id}`,
          getAttrs: (dom) => {
            if (!(dom instanceof HTMLElement)) {
              throw new Error();
            }
            console.log(dom)
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
        console.log(node)

        return [
          'div',
          {
            class:id,
            'data-identity':node.attrs["identity"],
            'data-type': node.attrs["type"],
            'data-choice':(node.attrs["choice"]),
            'data-correctAnswer':(node.attrs["correctAnswer"]),
          },
          'clickMe'
        ]
      },
      parseMarkdown: { // running along with syntax of https://github.com/micromark/micromark-extension-directive#syntax to ease parsing and serializing
        match: (node) => {
          return node.type === 'leafDirective' && node.name === id;// TODO: test if name match is buggy
        },
        runner: (state, node, type) => {
          console.log(node)
          type markdownNodeType = {
            type:string,
            attributes:Record<string,string>
          }
          state.addNode(type, { 
            identity:(node as markdownNodeType).attributes['identity'] as string,
            type: (node as markdownNodeType).attributes['type'] as string,
            choice:JSON.parse((node as markdownNodeType).attributes['choice'] as string),
            correctAnswer:JSON.parse((node as markdownNodeType).attributes['correctAnswer'] as string),
          });
        }
      },
      toMarkdown: {
        match: (node) => node.type.name === id,
        runner: (state, node) => {
          console.log(node)
          state.addNode('leafDirective', undefined, undefined, {
            name: id,
            attributes:{
              identity: node.attrs.identity,
              type: node.attrs.type,
              choice: JSON.stringify(node.attrs.choice),
              correctAnswer: JSON.stringify(node.attrs.correctAnswer),
            }
          });
        }
      }
  }},
  inputRules: (nodeType) => [
    new InputRule(
      /%\{qa-multi\}/,
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
  commands: (nodeType) => [createCmd(InsertMulti, 
    (ques_in) => (state, dispatch) => {
    if (!dispatch) return true;
    const { tr } = state;
    const node = nodeType.create(defaultObj());
    if (!node) {
      return true;
    }
    console.log(node)
    // alert('command triggered.');
    const _tr = tr.replaceSelectionWith(node);
    dispatch(_tr.scrollIntoView());
    return true;
}
)],

  remarkPlugins: () => [directive as RemarkPlugin],
  view:(ctx)=>{
    return view(ctx);
  }
}),
// [EditorSlice]
);


