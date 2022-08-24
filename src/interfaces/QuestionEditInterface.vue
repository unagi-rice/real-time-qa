
<template >
<div id="QEInterface"/>
<InterfaceBase class="container" :title="title" :interface_tag="tag" :buttons="buttons" @save="savefun" @back="backfun" @publish="publishfun">
<el-container type="common layout">

    <el-card v-for="(ques,index) in currQuestionBank?.content" style="width:100%" :key="ques.id" @click="onSelect(ques.id)" shadow="hover">{{'"'+questionAnswer2Markdown(ques,currAnswerBank?.content[index] as answer)+"\""}}</el-card>
    <el-card @click="createfun" shadow="hover" style="width:100%;text-align: center;"><el-icon :size="20"><Plus/></el-icon></el-card>
    <Teleport to="#QEInterface">

      <Dialog :show="editorShowed" @close="handleEditorClose">
      <template #header> 
        <h3>请编辑</h3>
      </template>
        <template #body> 
          
          <MilkdownEditor 
    :question="currQuestionBank?.content.find((elem:question)=>elem.id === currQuestionID) " :answer="currAnswer"
    @update="updatefun"/>
      </template>
    </Dialog>
          </Teleport>

</el-container>

</InterfaceBase>

</template>

<script setup lang="ts">
import { ref,onMounted,inject,provide,onBeforeMount,computed, watch, Ref } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {answer, answerBank, interfaces,question,questionBank} from '../components/Types';
import {questionBankStorage,answerBankStorage} from '../components/utils/user'
import MilkdownEditor from '../components/editor/MilkdownEditor.vue'
import {ElMessageBox} from 'element-plus'
import { questionAnswer2Markdown } from '../components/editor/MarkdownUtils';
import { Edit, Plus } from '@element-plus/icons-vue';
import { v1 } from 'uuid';
import Dialog from '../components/Dialog.vue';
const title = "编辑题目";
const tag = "tag";
const buttons:button[] = [
  
  {
    text:'保存',
    event:'save'
  },
  {
    text:'发布',
    event:'publish'
  },
  {
    text:'返回',
    event:'back'
  },
]

interface Props{
  questionBank_id:string
}
const props = defineProps<Props>()
const emit = defineEmits<{
(e:'publish',id:questionBank["id"]):void
}>()


// App-wide variables
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage= inject<{current_interface_displayed:Ref<interfaces>,changeInterface:(next:interfaces)=>void}>("interface");
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
// console.debug('QuestionEditInterface.vue: currentInterface =',interfaceStorage?.current_interface_displayed)

// reactive variables
const editorShowed = ref(false);
const askingCloseEditor = ref(false);
const firstSelected = ref(false);
const currQuestionBank = ref((questionBankStorage.content() as questionBank[]).find((elem)=>elem.id === props.questionBank_id)) 
const currAnswerBank = ref((answerBankStorage.content() as answerBank[]).find((elem)=>elem.qid === props.questionBank_id)) 
const currQuestionID = ref('')
const currAnswerID = ref('')
const currQuestion = ref<question>({id:'',content:[]}) // TEST-ITEM: ensure not to show when no question is selected
const currAnswer = ref<answer>({id:'',content:{}}) 

watch(()=>props.questionBank_id,()=>{
  console.log(`question id changed to ${props.questionBank_id}`)
  currQuestionBank.value = (questionBankStorage.content() as questionBank[]).find((elem)=>elem.id === props.questionBank_id)
  currAnswerBank.value = ((answerBankStorage.content() as answerBank[]).find((elem)=>elem.qid === props.questionBank_id)) 
})


let isSaved = true;

// save a question to questionBank
function bufferQuestion(question_in: question)
{
  let matchInd:number
  if(!currQuestionBank.value)return
  if((matchInd = currQuestionBank.value?.content.findIndex((elem:question)=>elem.id === question_in.id)) !== -1){
    currQuestionBank.value.content[matchInd] = (question_in);
  }
  else currQuestionBank.value.content.push((question_in));
}

// save whole questionBank to localStorage
function saveData(){
  if(currQuestionBank.value)questionBankStorage.add(currQuestionBank.value as questionBank)
  if(currAnswerBank.value)answerBankStorage.add(currAnswerBank.value as answerBank)
  console.debug('saveData()')
  isSaved = true;
}



// emit related
function createfun(){
  let newQuestion:question = {
    id:v1(),
    content:[]
  }
  let newAnswer:answer = {
    id:v1(),
    content:{}
  }
    currQuestionBank.value = (questionBankStorage.content() as questionBank[]).find((elem)=>elem.id === props.questionBank_id);
  currAnswerBank.value = ((answerBankStorage.content() as answerBank[]).find((elem)=>elem.qid === props.questionBank_id)) ;

  console.log(props.questionBank_id)
  console.log(questionBankStorage.content(),answerBankStorage.content())
  console.log(currQuestionBank.value,currAnswerBank.value)
  if(!currQuestionBank.value || !currAnswerBank.value)return;
  (currQuestionBank.value as questionBank).content.push(newQuestion);
  (currAnswerBank.value as answerBank).content.push(newAnswer)
}
function updatefun(question_in:question,answer_in:answer){
  isSaved = false;
  if(currQuestionBank.value)(currQuestionBank.value as questionBank).content[currQuestionBank.value.content.findIndex((elem:question)=>elem.id === question_in.id)] = question_in
 if(currAnswerBank.value) (currAnswerBank.value as answerBank).content[currAnswerBank.value.content.findIndex((elem:answer)=>elem.id === answer_in.id)] = answer_in
}

// back to main interface
function backfun(){
  if(currQuestionID.value !== '' && currQuestionBank.value)bufferQuestion(currQuestionBank.value.content.find((elem)=>elem.id === currQuestionID.value) as question)
  // console.log("back hitted.")

  // 转换界面至MainInterface
  setTimeout(() => {
    // 转换界面至QuestionAnswerInterface
    interfaceStorage?.changeInterface(interfaces.MainInterface)
    console.debug(interfaceStorage?.current_interface_displayed)
  }, 300);
  // console.debug(interfaceStorage?.current_interface_displayed)
}
function publishfun(){
  console.log("publish hitted.")
  if(!isSaved){
    ElMessageBox.confirm('你尚未保存题目，确定继续？').then(()=>{
      emit('publish',props.questionBank_id);
    setTimeout(() => {
      // 转换界面至QuestionAnswerInterface
      interfaceStorage?.changeInterface(interfaces.QuestionAnswerInterface)
      console.debug(interfaceStorage?.current_interface_displayed)
    }, 300);
    })
  }
  else{
    
    emit('publish',props.questionBank_id);
      setTimeout(() => {
        // 转换界面至QuestionAnswerInterface
        interfaceStorage?.changeInterface(interfaces.QuestionAnswerInterface)
        console.debug(interfaceStorage?.current_interface_displayed)
      }, 300);
  }

}

function savefun(){
  isSaved = true;
  saveData();
}

const handleEditorClose = () => {
  bufferQuestion(currQuestion.value)
  editorShowed.value = false;

}
function onSelect(question_id:string)
{
  console.debug(`onSelect: ${question_id}`);
  editorShowed.value = true;
  currQuestionID.value = question_id
  let matchInd
  if(currQuestionBank.value && (matchInd = currQuestionBank.value?.content.findIndex((elem)=>elem.id === question_id)) !== -1){
    currQuestion.value = currQuestionBank.value.content[matchInd as number];
  currAnswer.value = (currAnswerBank.value as answerBank).content[matchInd as number];
  }

}


watch(()=>props.questionBank_id,
()=>{
  currQuestionBank.value = (questionBankStorage.content() as questionBank[]).find((elem: questionBank)=>elem.id === props.questionBank_id)
})

</script>



<style scoped>

.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left:25%;
  width:50%;
  margin-left: -150px;
}
</style>


