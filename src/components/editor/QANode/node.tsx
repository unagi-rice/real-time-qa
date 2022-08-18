// TODO: move from vue-milkdown-sample
import { Teleport,h,DefineComponent, defineComponent } from 'vue';
import { RenderVue } from '@milkdown/vue';
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

export const QANodeView:DefineComponent = defineComponent({
    name: 'qa',
    setup(_, { slots }) {
        return () => <div class="qa"
        onClick={()=>{
            // TODO: show answer editor
            alert('the node is clicked!');
        }}
        >{slots.default?.()}</div>;
    },
});

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
                        class: utils.getClassName(node.attrs, 'qa'),
                        'data-type': id,
                        'data-question': node.attrs['question'] || node.textContent || '', 
                    },
                    0,
                ];
            },
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
        view: RenderVue(QANodeView),
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


