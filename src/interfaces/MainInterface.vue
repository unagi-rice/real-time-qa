<script setup lang="ts">
import { onMounted,inject, ref, computed, Ref } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {answerBank, interfaces, questionBank} from '../components/Types';
import {getUid, resetAuth} from '../components/Auth'
import { ArrowDownBold, Delete, Edit, Histogram } from '@element-plus/icons-vue';
import {answerBankStorage, questionBankStorage} from '../components/utils/user'
import { v1 as getuuid } from 'uuid';
import { Content } from '@milkdown/vue';


const title = "实时问答插件 | 主页";
const tag = "";
const buttons:button[] = [
  // {
  //   text:'edit',
  //   event:'edit'
  // },
  {
    text:'创建试卷',
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
const interfaceStorage= inject<{current_interface_displayed:Ref<interfaces>,changeInterface:(next:interfaces)=>void}>("interface")
// const interfaceStorage= context.createStorage<{currentInterface:interfaces}>("interface")
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
console.debug('currentInterface =',interfaceStorage?.current_interface_displayed)

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
    interfaceStorage?.changeInterface(interfaces.QuestionEditInterface)// BUG: state changed but interface displayed not changed
    console.debug('switch to interface',interfaces[interfaceStorage?.current_interface_displayed.value??-1])
    }, 300);
}
function statsfun(questionBankID:string){
  setTimeout(() => {
    interfaceStorage?.changeInterface(interfaces.StatsInterface)
    console.debug(interfaceStorage?.current_interface_displayed.value)
  }, 300);
}

function pubfun(questionBankID:questionBank['id']){
  emit('publish', questionBankID)
  setTimeout(() => {
    interfaceStorage?.changeInterface(interfaces.QuestionAnswerInterface)
    console.debug(interfaceStorage?.current_interface_displayed.value)
  }, 300);
}




onMounted(()=>{
    console.debug('interface:title=',title,'tag=',tag);
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
    @create="createfun" >
    <!-- @edit="editfun"  -->

    <el-container>
      <div style="width: 100%" v-if="questionBanks.length>0">
        <el-card class="question-set-item" v-for="questionBank_i in questionBankStorage.content()" :key="questionBank_i.id" >
          <el-row justify="space-between" align="middle"> 
            <span>{{ questionBank_i.title }}</span> 
            <el-button-group class="ml-4">
              <el-button class="button" text bg @click="editfun(questionBank_i.id)">Edit</el-button>
              <el-button class="button" text bg @click="pubfun(questionBank_i.id)">Publish</el-button>
              <el-button class="button" text bg @click="statsfun(questionBank_i.id)">Statistics</el-button>
              <el-popconfirm title="确定删除" confirm-button-text="确定" cancel-button-text="取消" @confirm="deleteQuestionBank(questionBank_i.id)"><template #reference>
                <el-button class="button" text bg type="danger" >Delete</el-button>
              </template></el-popconfirm>
            </el-button-group>
          </el-row>
        </el-card>
      </div>
      <div v-else class="empty-content">看起来你还没创建卷子呢...</div>
    </el-container>
      <el-form v-model="newQBank" @submit.prevent>
    <el-dialog v-model="creatingQBank" title="创建试卷">
      <el-form-item label="名称"><el-input v-model="newQBank.name"/></el-form-item>
        <template #footer> 
          <el-form-item>
            
            <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="closeDialog">取消</el-button>
  </el-form-item>
        </template>
      
    </el-dialog>
            </el-form>
  </InterfaceBase>
</template>
<style scoped>
div.question-set-item{
  width:100%;
  
}
.el-container{
  height:100%
}
.empty-content{
  width:100%;
  height: 100%;
  text-align: center;
  padding-top:10px
}
</style>