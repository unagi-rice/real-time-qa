import {type RemarkPlugin } from "@milkdown/core";
import { AtomList, createNode } from "@milkdown/utils";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { InputRule } from "prosemirror-inputrules";

import directive from "remark-directive";

import "./style.css";

const id = "iframe3";
export const iframe3 = createNode(() => ({
  id,
  schema: () => ({
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
        }
      }
    ],
    toDOM: (node) => ["div", { ...node.attrs, class: id,onclick:"alert('hi')" }, node.attrs.question as string],
    parseMarkdown: {
      match: (node) => {
        return node.type === "textDirective" && node.name === id;
      },
      runner: (state, node, type) => {
        state.addNode(type, { question: (node.attributes as { question: string }).question });
      }
    },
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
  }),
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

  remarkPlugins: () => [directive as RemarkPlugin],
}));


