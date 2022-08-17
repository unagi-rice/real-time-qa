<!-- 界面模板 -->
<script setup lang="ts">
import { onMounted,inject } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {interfaces} from '../components/Types';

const title = "Main Interface";
const tag = "tag";
const buttons:button[] = [
    {
        text:'edit',
        event:'edit'
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
const interfaceStorage= inject<Storage<{currentInterface:interfaces}>>("interface");
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
console.debug('EmptyInterface.vue: currentInterface =',interfaceStorage.state.currentInterface)
function backfun(){
    // 转换界面至EmptyInterface
    interfaceStorage?.setState({currentInterface:interfaces.EmptyInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}
function nextfun(){
    // 转换界面至ExampleCounter
    interfaceStorage?.setState({currentInterface:interfaces.StatsInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}
function wowfun(){
    alert('WOW!');
}
function editfun(){
    interfaceStorage?.setState({currentInterface:interfaces.QuestionEditInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}
function createfun(){
    interfaceStorage?.setState({currentInterface:interfaces.QuestionEditInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}
const emit = defineEmits<{
(e:'console-log',id:number):void
// usage: emit('console-log',3) to pass 3 to parent component in event 'console-log'
}>()
onMounted(()=>{
    console.debug('emptyInterface.vue:title=',title);
  console.debug('emptyInterface.vue:tag=',tag);
  emit('console-log',4);
  })
</script>

<!--定义展示的模块-->
<template>
<!--     
需要至少传入：title（界面标题，预计用来展示题集名字）
传入
@back, @next为以上buttons中所定义的事件event，backfun、nextfun为事件的处理函数
-->
    <InterfaceBase 
        :title="title" 
        :interface_tag="tag" 
        :buttons="buttons" 
        @edit="editfun" 
        @create="createfun" >

        <el-container>

    <el-row type="flex" justify="center">
      <el-space fill direction="vertical" style="width: 85%">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>题目 #1： 你的老婆是谁？</span>
            </div>
          </template>
        </el-card>

        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>题目 #2： 你的老婆是谁？</span>
            </div>
          </template>
        </el-card>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>题目 #3： 最希望成为谁的老公 / 老婆</span>
            </div>
          </template>
        </el-card>
      </el-space>
    </el-row>
  </el-container>

    </InterfaceBase>

</template>