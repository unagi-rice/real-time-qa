<script setup lang="ts">
import { onMounted } from 'vue';
import InterfaceBase from './InterfaceBase.vue'
import {button as button} from './InterfaceBase.vue'
const title="Lorem Ipsum"
const tag="foo"
const buttons:button[] = [
    {
        text:'button1',
        event:'change',
        handler:'change'
    },
    {
        text:'button2',
        event:'next',
        handler:'next'
    },

]
const exposeobj={
    title,
    tag,
    buttons
}
defineExpose(exposeobj)
function change(){
    console.log("change hitted.")
}
function next(){
    console.log("next.hitted.")
}
onMounted(()=>{
  console.log('emptyInterface.vue:title=',title);
  console.log('emptyInterface.vue:tag=',tag);
  })

</script>

<!--定义展示的模块-->
<template>
<h1>Hello World</h1>
<input/>
</template>