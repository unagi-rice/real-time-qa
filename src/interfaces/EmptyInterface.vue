<!-- 界面模板 -->
<script setup lang="ts">
import { onMounted,inject } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {interfaces} from '../components/Types';
import {loginTeacher, checkTeacher} from '../components/Auth'
// import { emitter } from '@netless/window-manager/dist/InternalEmitter';

const title = "Empty Interface";
const tag = "tag";
const buttons:button[] = [
    {
        text:'back',
        event:'back'
    },
    {
        text:'next',
        event:'next'
    },
    {
        text:'wow',
        event:'wow'
    },

]
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage = 
    inject<Storage<{currentInterface:interfaces}>>("interface");
if (!interfaceStorage) 
    throw new Error("must call provide('interface') before mount App");

console.debug('EmptyInterface.vue: currentInterface =',interfaceStorage.state.currentInterface)
function backfun(){
    // 转换界面至EmptyInterface
    interfaceStorage?.setState({currentInterface:interfaces.StatsInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}
function nextfun(){
    // 转换界面至ExampleCounter
    interfaceStorage?.setState({currentInterface:interfaces.QuestionAnswerInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}
function wowfun(){
    alert('WOW!');
}

const emit = defineEmits<{
(e:'console-log',id:number):void
// usage: emit('console-log',3) to pass 3 to parent component in event 'console-log'
}>()
onMounted(()=>{
    console.debug('emptyInterface.vue:title=',title);
  console.debug('emptyInterface.vue:tag=',tag);
  emit('console-log',0);
  })
</script>

<!--定义展示的模块-->
<template>
<!--     
需要至少传入：title（界面标题，预计用来展示题集名字）
传入
@back, @next为以上buttons中所定义的事件event，backfun、nextfun为事件的处理函数
-->
<InterfaceBase :title="title" :interface_tag="tag" :buttons="buttons" 
@back="backfun" @next="nextfun" @wow="loginTeacher(context) && checkTeacher(context)">



<h1>Lorem Ipsum</h1><br/>
<span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>

</InterfaceBase>
</template>