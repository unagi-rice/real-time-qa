<template>
    <div @click="showPreview"></div>
    <!--TODO:answer editor here-->
    <!--TODO:answer rendered view-->
</template>
<script lang="ts">

import { defineComponent, inject, ref } from 'vue';
import { useNodeCtx } from '@milkdown/vue';
import type { Node } from '@milkdown/prose/model';
import {EditorSlice} from './node'

export default defineComponent({
    name: 'QANodeVue',
});

</script>

<script setup lang="ts">
const metadata = useNodeCtx<Node>();
const attrs = metadata.node.value.attrs;
const questionContent = metadata.ctx.get(EditorSlice);
console.debug('entered vue')


const showInput = attrs['showInput'] ?? false;

const parent = document.getElementById('question-editor');

const showEditor = ref(false);

const showPreview = inject('showPreview');
const emit = defineEmits<{
    (e:'openPreview',answerContainer:string):boolean
}>();

const openPreview = () => {
    // get type of clicked 
    let clickedType:string = attrs.question.type;
    emit('openPreview',clickedType);
};

// change 
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
        target.value = node.value.attrs['question'];
        return;
    }
    const { tr } = view.state;
    view.dispatch(
        tr.setNodeMarkup(getPos(), undefined, {
            ...node.value.attrs,
            question: value,
        }),
    );
};

const toggleInput = () => {
    const view = metadata.view;
    const node = metadata.node;
    const getPos = metadata.getPos;
    if (!view.editable) {
        return;
    }
    const show = node.value.attrs['showInput'];
    const { tr } = view.state;
    view.dispatch(
        tr.setNodeMarkup(getPos(), undefined, {
            ...node.value.attrs,
            showInput: !show,
        }),
    );
};

const onKeydown = (e: KeyboardEvent) => {

    e.stopPropagation();
};


</script>


<style scoped>
.code-fence {
    border: 1px solid #ccc;
    padding: 10px;
}

.control {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
}

.code {
    background: #ccc;
    margin: 0 auto !important;
    white-space: pre;
    border-radius: 4px;
    padding: 10px;
}
</style>
