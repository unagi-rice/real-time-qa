// TODO: create a node which alert()
// TODO: make it run
// TODO: change to <Teleport> from vue
// TODO: move back to real-time-qa code
/* Copyright 2021, Milkdown by Mirone. */
import { createCmd, createCmdKey, themeManagerCtx,type ThemeInnerEditorType, type RemarkPlugin,createSlice } from '@milkdown/core';
import { expectDomTypeError } from '@milkdown/exception';
import { setBlockType } from '@milkdown/prose/commands';
import { InputRule } from '@milkdown/prose/inputrules';
import { NodeSelection } from '@milkdown/prose/state';
import type { NodeView } from '@milkdown/prose/view';
import { createNode } from '@milkdown/utils';
import type { MilkdownPlugin } from '@milkdown/core';
import { stringLiteral } from '@babel/types';
import directive from "remark-directive";
import type {  Node } from '@milkdown/prose/model';
import { customAlphabet } from 'nanoid';

import {remarkQA} from '.';
import {getStyle} from './style';

import {type question  as Question,type questionBank,questionType,type answerContainer, objectiveQuestionType} from '../components/Types'

const nanoid = customAlphabet('abcedfghicklmn', 10);

const getId = (node?: Node) => node?.attrs?.['identity'] || nanoid();

// import 

// import { getStyle } from './style';
// import { getId } from './utility';

const inputRegex = /^```qa$/;


export type Options = {
    placeholder: {
        empty: string;
        error: string;
    };
    // theme: mermaidAPI.Theme;
    // themeCSS: string;
};
export const InsertQA = createCmdKey('InsertQA');
const questionState = createSlice({id:0,content:[]},'questions')

export const QANode = createNode<string,Options>((utils,options)=>{
    // const theme = options?.theme ?? undefined;
    // const themeCSS = options?.themeCSS ?? undefined;

    const id = 'QANode';

    const placeholder = {
        empty: 'Empty',
        error: 'Error',
        ...(options?.placeholder ?? {}),
    };

    return {// format can be found
        id,
        schema: (ctx) => {
            const currQuestionState = ctx.get(questionState);
            return {// format can be found in ProseMirror Reference manual https://prosemirror.net/docs/ref/#model.NodeSpec
            content: 'block+',
            group: 'inline',
            marks: '',
            defining: true,
            atom: true,
            isolating: true,
            attrs: {
                type: {default:questionType.FreeResponse},// 
                identity: {// to identify component
                    default: '',
                },
                question:{default:''},
                
            },
            // method to parse DOM into attr
            // TODO: 
            parseDOM: [
                {
                    tag: `div[data-type="${id}"]`,
                    preserveWhitespace: 'full',
                    getAttrs: (dom) => {
                        if (!(dom instanceof HTMLElement)) {
                            throw expectDomTypeError(dom);
                        }
                        return {
                            type:'',
                            identity: dom.id,
                            question: dom.dataset['question'],
                        };
                    },
                },
            ],
            // CORE, can be used with vue component,return type: DOMOutputSpec
            toDOM: (node) => {
                const identity = getId(node);
                
                return [
                    'div',
                    {
                        id: identity,
                        class: utils.getClassName(node.attrs, 'mermaid'),
                        'data-type': id,
                        'data-question': node.attrs['question'] || node.textContent || '', 
                    },
                    0,
                ];
            },
            // TODO: 
            parseMarkdown: {
                match: ({ type }) => type === id,
                runner: (state, node, type) => {
                    const question = node['question'] as string;
                    state.openNode(type, { question });
                    if (question) {
                        state.addText(question);// just put raw text
                        
                    }
                    state.closeNode();
                },
            },
            toMarkdown: {
                match: (node) => node.type.name === id,
                runner: (state, node) => {
                    state.addNode('code', undefined, node.content.firstChild?.text || '', { lang: 'real-time-qa' });
                },
            },
        }},
        commands: (nodeType) => [createCmd(InsertQA, () => setBlockType(nodeType, { id: getId() }))],
        // used to define node view for the plugin.
        view: (ctx) => (node, view, getPos) => {
            const currentId = node.type;
            let header = '';
            let currNode = node;

            const nodeId = getId(currNode);
            
            // TODO: HTMLElement for question
            class qaNodeHTML{
                element:HTMLElement|'';
                questions: questionType[];
                constructor (){
                    this.element = ''
                    this.questions = []
                }

            }

            const qaNodeHTML_instance = new qaNodeHTML;

            
            const renderer = utils.themeManager.get('qa', {
                view,
                getPos,
                editable: () => view.editable,
                render: (code:JSON) => {
                    try {
                        if (!code) {
                            renderer.preview.innerHTML = placeholder.empty;
                        } else {
                            renderer.preview.innerHTML = qaNodeHTML_instance.render;
                        }
                    } catch {
                        const error = document.getElementById('d' + currentId);
                        if (error) {
                            error.remove();
                        }
                        renderer.preview.innerHTML = placeholder.error;
                    } finally {
                        renderer.dom.appendChild(renderer.preview);
                    }
                },
            });
            if (!renderer) return {} as NodeView;

            const { dom, contentDOM, onUpdate, onDestroy } = renderer;
            onUpdate(currNode);
            
            return {
                dom,
                contentDOM,
                update: (updatedNode) => {
                    if (updatedNode.type.name !== id) return false; // only update node with same type
                    currNode = updatedNode;
                    onUpdate(currNode);
                    return true;
                },
                destroy: onDestroy,
            };
        },
        //  trigger by typing and make node
        // inputRules: (nodeType) => [
        //     new InputRule(inputRegex, (state, _match, start, end) => {
        //         //
        //         const $start = state.doc.resolve(start);
        //         if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) return null;
        //         const tr = state.tr.delete(start, end).setBlockType(start, start, nodeType, { id: getId() });

        //         return tr.setSelection(NodeSelection.create(tr.doc, start - 1));
        //     }),
        // ],
        remarkPlugins: () => [directive as RemarkPlugin],
    };
});


