import {createCmd, createSlice, editorViewCtx, EditorViewReady, type MilkdownPlugin, type RemarkPlugin } from "@milkdown/core";
import { AtomList, createNode, type NodeCreator, type UnknownRecord } from "@milkdown/utils";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { InputRule } from "prosemirror-inputrules";
import type { Fragment, Node } from '@milkdown/prose/model';
import type { RenderVue } from "@milkdown/vue";

import directive from "remark-directive";
import {InsertSmth} from '.';

import "./style.css";
import { setBlockType } from "prosemirror-commands";
import { inject } from "vue";
import type { question } from "../Types";

// TODO: question types

const id = "QANode";

export class smljClass{
  member=3;
  needShow=false;
  show(){this.needShow = !this.needShow}
  Alert(){alert('greeting from smljClass')}
}



export function myAlert(){
  // const injectedValue = inject<question>('') 
}
export const EditorSlice = createSlice(new smljClass(),'smljState')


export const QANode:(view:ReturnType<RenderVue<Node>>)=>NodeCreator<string,UnknownRecord> = (view)=>createNode((utils,options) => ({
  id,
  schema: function(ctx) {
    const editor = ctx.get(EditorSlice);
    function toggleNeedShow(){
      // alert('test')
      editor.needShow = !(editor.needShow)
      console.debug(editor);
      // editor.Alert();
    };
    return {
      attrs: {
        question: { default: '' }
      },
      group: "inline",
      inline: true,
      marks: "",
      atom: true,
      parseDOM: [
        {
          tag: "div",
          getAttrs: (dom) => {
            if (!(dom instanceof HTMLElement)) {
              throw new Error();
            }
            return {
              src:"hi",
              question: dom.getAttribute("question")
            };
          },
          // getContent: get HTMLContent
        }
      ],
      toDOM: (node) => {
        const button = document.createElement('div');
        button.classList.add(id);
        button.innerHTML = 'clickMe';
        button.onclick = ()=>{
          toggleNeedShow();
          myAlert();
        }
        const editorBox = document.createElement('div');
        editorBox.onchange = (e)=>{
          const target = e.target;
          if (!(target instanceof HTMLSelectElement))
            return;
          const view = ctx.get(editorViewCtx);
          if (!view.editable) {
            target.value = node.attrs['language'];
            return;
          }

          const { top, left } = target.getBoundingClientRect();
          const result = view.posAtCoords({ top, left });
          if (!result) return;

          const { tr } = view.state;

          view.dispatch(
            tr.setNodeMarkup(result.inside, undefined, {
                ...node.attrs,
            }),
          );
        }
        return {
          dom:button,
          contentDOM:editorBox
        }
        },
      parseMarkdown: {
        match: (node) => {
          return node.type === "textDirective" && node.name === id;
        },
        runner: (state, node, type) => {
          state.addNode(type, { question: (node.attributes as { question: string }).question });
        }
      },
      // TODO: change 
      toMarkdown: {
        match: (node) => node.type.name === id,
        runner: (state, node) => {
          state.addNode("textDirective", undefined, undefined, {
            name: id,
            attributes: {
              question: node.attrs.question
            }
          });
        }
      }
  }},
  inputRules: (nodeType) => [
    new InputRule(
      /\$iframe\{question="(?<question>[^"]+)?"?\]/,
      (state, match, start, end) => {
        const [okay, question = ""] = match;
        const { tr } = state;
        if (okay) {
          tr.replaceWith(start, end, nodeType.create({ question }));
        }

        return tr;
      }
    )
  ],
  commands: (nodeType) => [createCmd(InsertSmth, () => setBlockType(nodeType))],

  remarkPlugins: () => [directive as RemarkPlugin],
  view:(ctx)=>{
    return view(ctx);
  }
}),[EditorSlice]);


