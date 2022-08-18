/* Copyright 2021, Milkdown by Mirone. */

import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

const createQADiv = (contents: string) => ({
    type: 'qa',
    value: contents,
});

const visitCodeBlock = (ast: Node) =>
    visit(ast, 'code', (node, index, parent: Parent) => {
        const { lang, value } = node;

        // If this codeblock is not qa, bail.
        if (lang !== 'qa') {
            return node;
        }

        const newNode = createQADiv(value);

        if (parent && index != null) {
            parent.children.splice(index, 1, newNode);
        }

        return node;
    });

export const remarkQA = () => {
    function transformer(tree: Node) {
        visitCodeBlock(tree);
    }

    return transformer;
};
