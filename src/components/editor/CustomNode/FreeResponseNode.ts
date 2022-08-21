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
import { subjectiveQuestionType } from "../../Types";
import { v1 } from "uuid";
import "./style.css"
// TODO: question types

export const id = "FreeResponseNode";

const defaultObj = ()=>({ 
  identity:v1(),
  type:subjectiveQuestionType.FreeResponse,
 })

export const InsertFreeResponse = createCmdKey();


// export const EditorSlice = createSlice(new smljClass(),'smljState')


export const FreeResponseNode:NodeCreator<string,UnknownRecord> = createNode((utils,options) => ({
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
      attrs: {
        identity: {default:defaultObj().identity},
        type:{default:defaultObj().type},
      },
      content:'block+',
      group: "block",
      marks: "",
      atom: true,
      parseDOM: [
        {
          tag: `div.${id}`,
          preserveWhitespace: 'full',
          getAttrs: (dom) => {
            if (!(dom instanceof HTMLElement)) {
              throw new Error();
            }
            return {
              identity:dom.dataset["identity"],
              type: dom.dataset["type"],

            };
          },
          // getContent: get HTMLContent
        }
      ],
      toDOM: (node) => {
        
        return [
          'div',
          {
            class:id,
            'data-identity':node.attrs["identity"],
            'data-type': node.attrs["type"],
          },
          0
        ]
      },
      parseMarkdown: {
        match: (node) => {
          return node.type === "leafDirective" && node.id === id;// TODO:
        },
        runner: (state, node, type) => {
          type markdownNodeType = {
            type:string,
            attributes:Record<string,string>
          }
          state.addNode(type, { 
            identity:(node as markdownNodeType).attributes["identity"] as string,
            type: (node as markdownNodeType).attributes["type"] as string,

          });
        }
      },
      toMarkdown: {
        match: (node) => node.type.name === id,
        runner: (state, node) => {
          state.addNode("leafDirective", undefined, undefined, {
            name: id,
            attributes:{
              identity: node.attrs.identity,
              type: node.attrs.type,
              
            }
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
  commands: (nodeType) => [createCmd(InsertFreeResponse, (ques_in) => (state, dispatch) => {
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
}),
// [EditorSlice]
);


