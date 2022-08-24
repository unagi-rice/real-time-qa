<script setup lang="ts">
import { onMounted,inject, ref, computed } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {answerBank, interfaces, questionBank} from '../components/Types';
import {getUid, resetAuth} from '../components/Auth'
import { ArrowDownBold, Delete, Edit, Histogram } from '@element-plus/icons-vue';
import {answerBankStorage, questionBankStorage} from '../components/utils/user'
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
(e:'publish',id:questionBank["id"]):void
(e:'edit',id:questionBank["id"]):void
// usage: emit('console-log',3) to pass 3 to parent component in event 'console-log'
}>()

const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage= inject<Storage<{currentInterface:interfaces}>>("interface");
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
console.debug('EmptyInterface.vue: currentInterface =',interfaceStorage.state.currentInterface)

const questionBanks = ref((()=>questionBankStorage.content() as questionBank[])());
const newQBank = ref({
  name:"questionBank " + questionBanks.value.length.toString()
})
const creatingQBank = ref(false)
function createfun(){
    newQBank.value.name = "卷子 " + questionBanks.value.length.toString()
    console.log('create triggered')
  creatingQBank.value = true;
}
function closeDialog(){
  creatingQBank.value = false;
}
function onSubmit(){
  console.log( newQBank.value.name)
  let newQuestionBank= {id: getuuid(), title: newQBank.value.name, content: []} as questionBank
  // dialog
  let newAnswerBank= {uid: getUid(context), qid: newQuestionBank.id, content: {}} as answerBank
  questionBankStorage.add(newQuestionBank)
  answerBankStorage.add(newAnswerBank)
  questionBanks.value = questionBankStorage.content();
  closeDialog();
}
function deleteQuestionBank(questionBankID:questionBank["id"]){
  questionBankStorage.remove(questionBankID)
  questionBanks.value = questionBankStorage.content();
}
function editfun(questionBankID:string){
  emit('edit',questionBankID)
  setTimeout(() => {
    interfaceStorage?.setState({currentInterface:interfaces.QuestionEditInterface})
    console.debug(interfaceStorage?.state.currentInterface)
  }, 300);
}
function statsfun(questionBankID:string){
  setTimeout(() => {
    interfaceStorage?.setState({currentInterface:interfaces.StatsInterface})
    console.debug(interfaceStorage?.state.currentInterface)
  }, 300);
}

function pubfun(questionBankID:questionBank['id']){
  emit('publish', questionBankID)
  setTimeout(() => {
    interfaceStorage?.setState({currentInterface:interfaces.QuestionAnswerInterface})
    console.debug(interfaceStorage?.state.currentInterface)
  }, 300);
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
      <div v-if="questionBanks.length>0">
        <el-space wrap>
          <el-card v-for="questionBank_i in questionBankStorage.content()" :key="questionBank_i.id" class="box-card" style="width: 18vmax">
          
            <template #header>
              <el-row justify="center" align="middle"> 
                <span>{{ questionBank_i.title }}</span> 
              </el-row>
            </template>
            
            <el-button-group class="ml-4">
              <el-button class="button" text bg @click="editfun(questionBank_i.id)">Edit</el-button>
              <el-button class="button" text bg @click="pubfun(questionBank_i.id)">Publish</el-button>
              <el-button class="button" text bg @click="statsfun(questionBank_i.id)">Statistics</el-button>
              <el-popconfirm title="确定删除" confirm-button-text="确定" cancel-button-text="取消" @confirm="deleteQuestionBank(questionBank_i.id)"><template #reference>
                <el-button class="button" text bg type="danger" >Delete</el-button>
              </template></el-popconfirm>
            </el-button-group>
          </el-card>
        </el-space>
      </div>
        
      <div v-else>
        <el-space alignment="center">
          <el-card style="width:100%;">看起来你还没创建卷子呢...</el-card>
        </el-space>
      </div>
    </el-container>
    <el-dialog v-model="creatingQBank" title="创建新题集">
      <el-form v-model="newQBank" @submit.prevent>

        <p>新题集名称：</p>
      <el-form-item label="名字"><el-input v-model="newQBank.name"/></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </el-form-item>
      </el-form>
      
    </el-dialog>
  </InterfaceBase>
</template>