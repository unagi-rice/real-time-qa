<script setup lang="ts">
import { onMounted,inject } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {interfaces, questionBank, QuoBankInit, userType} from '../components/Types';
import {resetAuth} from '../components/Auth'
import { ArrowDownBold, Delete, Edit, Histogram } from '@element-plus/icons-vue';
import {questionBankStorage} from '../components/utils/user'
import { v1 as getuuid } from 'uuid';
import { Content } from '@milkdown/vue';


const title = "主界面";
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

]
const emit = defineEmits<{
(e:'publish',id:string):void
// usage: emit('console-log',3) to pass 3 to parent component in event 'console-log'
}>()

const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage= inject<Storage<{currentInterface:interfaces}>>("interface");
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
console.debug('EmptyInterface.vue: currentInterface =',interfaceStorage.state.currentInterface)


function editfun(questionBankID:string){
    emit('edit',questionBankID)
    interfaceStorage?.setState({currentInterface:interfaces.QuestionEditInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}
function statsfun(){
    interfaceStorage?.setState({currentInterface:interfaces.StatsInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}

function pubfun(){
  // TODO:emit publish event
    emit('publish', getuuid())
    interfaceStorage?.setState({currentInterface:interfaces.QuestionAnswerInterface})
    console.debug(interfaceStorage?.state.currentInterface)
}
function createfun(){
  let newQuestionBank = {id: getuuid(), title: "Test"+ getuuid(), content: []} as questionBank
  QuoBankInit.questionBanks.push(newQuestionBank)
}



onMounted(()=>{
    console.debug('switched interface:title=',title,'tag=',tag);
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

    <el-container style="width: 100%">
      <el-space wrap>
        <el-card v-for="questionBank_i in QuoBankInit.questionBanks" :key="questionBank_i" class="box-card" >
        
          <template #header>
            <div class="card-header">
              <el-row justify="space-between" align="middle">
                <span>{{ 'Test ' + questionBank_i.title }}</span>
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
          <el-button @click="resetAuth(context)"></el-button>
          <!-- <div v-for="o in 3" :key="o" class="text item">
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
          </el-row> -->
        </el-card>
      </el-space>
    </el-container>
    <el-dialog>
      <!--TODO: give a name for newly created questionBank-->
    </el-dialog>
  </InterfaceBase>
</template>