<script setup lang="ts">
import { inject, defineComponent, DefineComponent } from 'vue';
import { Editor, rootCtx } from '@milkdown/core';
import { VueEditor, useEditor, useNodeCtx, NodeContext} from '@milkdown/vue';
import { nodeMetadata,VueNodeContainer} from '@milkdown/vue';
import { commonmark, paragraph, image } from '@milkdown/preset-commonmark';
import { Node } from 'prosemirror-model';

const metadata = useNodeCtx<Node>();
const attrs = metadata.node.value.attrs;
const languages = metadata.ctx.get(languageListSlice) ?? [];
const filename = attrs['filename'] ?? '';
const lang = attrs['language'] ?? '';
const showInput = attrs['showInput'] ?? false;
const onChange = (e: Event) => {
    const view = metadata.view;
    const node = metadata.node;
    const getPos = metadata.getPos;
    const { target } = e;
    if (!(target instanceof HTMLSelectElement)) {
        return;
    }
    const { value } = target;
    if (!view.editable) {
        target.value = node.value.attrs['language'];
        return;
    }
    const { tr } = view.state;
    view.dispatch(
        tr.setNodeMarkup(getPos(), undefined, {
            ...node.value.attrs,
            language: value,
        }),
    );
};

</script>
<template>
<VueNodeContainer :ctx="" :editor="" :node="" :view="" :getPos="" :decorations="" as="div" v/>
</template>