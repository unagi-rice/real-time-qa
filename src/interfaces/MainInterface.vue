<!-- 界面模板 -->
<script setup lang="ts">
import { onMounted,inject } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {interfaces} from '../components/Types';
import { ArrowDownBold, Delete, Edit, Histogram } from '@element-plus/icons-vue';

const title = "Main Interface";
const tag = "tag";
const buttons:button[] = [
    {
        text:'edit',
        event:'edit'
    },
    {
        text:'create',
        event:'create'
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
function statsfun(){
    interfaceStorage?.setState({currentInterface:interfaces.StatsInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}
function indstatsfun(){
    interfaceStorage?.setState({currentInterface:interfaces.IndividualStatsInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}
function pubfun(){
    interfaceStorage?.setState({currentInterface:interfaces.QuestionAnswerInterface})
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
    @create="backfun" 
    @wow="wowfun">

    <el-container>
      <el-space wrap>
        <el-card v-for="i in 10" :key="i" class="box-card" style="width: 785px">
        
          <template #header>
            <div class="card-header">
              <el-row justify="space-between" align="middle">
                <span>{{ 'Test ' + i }}</span>
                <el-button-group class="ml-4">
                  <!-- <el-button class="button" text bg type="primary">Preview</el-button> -->
                  <el-button class="button" text bg @click="editfun">Edit</el-button>
                  <el-button class="button" text bg @click="pubfun">Publish</el-button>
                  <el-button class="button" text bg @click="statsfun">Statistics</el-button>
                  <el-button class="button" text bg type="danger">Delete</el-button>
                </el-button-group>
              </el-row>
            </div>
          </template>

          <div v-for="o in 3" :key="o" class="text item">
            <el-card class="box-card">
              <el-row justify="space-between" align="middle">
                <el-col :span="18">
                  <span>{{ 'Question ' + o }}</span>
                </el-col>
                <el-button-group class="ml-4">
                  <el-button type="success"><el-icon color="#FFFFFF"><Edit /></el-icon></el-button>
                  <el-button type="success" @click="indstatsfun"><el-icon color="#FFFFFF"><Histogram /></el-icon></el-button>
                  <el-button type="danger" ><el-icon color="#FFFFFF"><Delete /></el-icon></el-button>
                </el-button-group>
              </el-row>
            </el-card>
          </div>
          <el-row justify="center" align="top">
            <el-button class="button" bg text @click="pubfun"><el-icon color="#39393A"><ArrowDownBold /></el-icon></el-button>
          </el-row>
        </el-card>
      </el-space>
    </el-container>
  </InterfaceBase>
</template>