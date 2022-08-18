import { inject, defineComponent, DefineComponent} from 'vue';
import { Editor, rootCtx } from '@milkdown/core';
import { VueEditor, useEditor , nodeMetadata ,NodeContext} from '@milkdown/vue';
import { commonmark, paragraph, image } from '@milkdown/preset-commonmark';
import { Node,Mark } from 'prosemirror-model';
import { createNode } from '@milkdown/utils';

const CustomParagraph: DefineComponent = defineComponent({
    name: 'my-paragraph',
    setup(_, { slots }) {
        return () => <div class="vue-paragraph">{slots.default?.()}</div>;
    },
});
const FreeAnswer: DefineComponent = defineComponent({
    name: 'my-paragraph',
    setup(_, { slots }) {
        return () => <div class="vue-paragraph">{slots.default?.()}</div>;
    },
});
const FreeAnswerNode = createNode()




