<script setup lang="ts">
import { inject, defineComponent, DefineComponent, nodeMetadata } from 'vue';
import { Editor, rootCtx } from '@milkdown/core';
import { VueEditor, useEditor } from '@milkdown/vue';
import { commonmark, paragraph, image } from '@milkdown/preset-commonmark';
import { Node } from 'prosemirror-model';

        const { node } = inject(nodeMetadata);

        return () => ``;
    
export const MyEditor = defineComponent(() => {
    const editor = useEditor((root, renderVue) => {
        const nodes = commonmark
            .configure(paragraph, {
              view: renderVue(CustomParagraph),
            })
            .configure(image, {
                view: renderVue(CustomImage),
            });
        return Editor.make()
            .config((ctx) => {
              ctx.set(rootCtx, root);
            })
            .use(nodes);
    });

    return () => <VueEditor editor={editor} />;
});
</script>
<template>
<img class="vue-image" :src="node.attrs.src" :alt="node.attrs.alt" />
</template>