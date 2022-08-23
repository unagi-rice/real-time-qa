
<template>

<InterfaceBase class="container" :title="title" :interface_tag="tag" :buttons="buttons" @preview="previewfun" @back="backfun" @publish="publishfun" @save="savefun">
<el-container type="common layout">
  <div id="question-list" size="100%" model-value="editingQuestion" >
    <el-card v-for="(ques,index) in questions?.content" :key="ques.id" @click="onSelect(index)" shadow="hover">{{questionAnswer2Markdown(ques,answers[index])}}</el-card>
    <el-card @click="createfun" shadow="hover"><Plus/></el-card>
  </div>
  <el-drawer v-model="editorShowed" >

    <!--TODO:preset=question content, onswitch:copy content to current question, onsave:copy content from question list to question set in storage-->
    <VueEditor v-if="firstSelected" mode="edit" :question="currQuestion" :answer="currAnswer"/>
  </el-drawer>
</el-container>

</InterfaceBase>

</template>

<script setup lang="ts">
import { ref,onMounted,inject,provide,onBeforeMount,computed, watch } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {answer, answerBank, interfaces,question,questionBank} from '../components/Types';
import {questionBankStorage,answerBankStorage} from '../components/utils/user'
import VueEditor from '../components/editor/VueEditor.vue'
import {ElMessageBox} from 'element-plus'
import { questionAnswer2Markdown } from '../components/editor/MarkdownUtils';
import { Edit, Plus } from '@element-plus/icons-vue';
import { v1 } from 'uuid';
const title = "";
const tag = "tag";
const buttons:button[] = [
  {
    text:'主页面',
    event:'back'
  },
  {
    text:'preview',
    event:'preview'
  },
  {
    text:'publish',
    event:'publish'
  },
]

interface Props{
  questionBank_id:string
}
const props = defineProps<Props>()
const emit = defineEmits<{
(e:'publish',id:number):void
(e:'update'):void
}>()


// App-wide variables
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage= inject<Storage<{currentInterface:interfaces}>>("interface");
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
// console.debug('QuestionEditInterface.vue: currentInterface =',interfaceStorage.state.currentInterface)

// reactive variables
const questions = ref((questionBankStorage.content() as questionBank[]).find((elem)=>elem.id === props.questionBank_id))
const answers = ref((answerBankStorage.content() as answerBank[]).find((elem)=>elem.qid === props.questionBank_id))
const editorShowed = ref(false);
const firstSelected = ref(false);
const currQuestionBank = ref() // TODO: reactive questionBank clone, initialize 
const currAnswerBank = ref() 
const currQuestionID = ref('') // TODO: initialize at first select, trigger 
const currAnswerID = ref('')
const currQuestion = ref<question | undefined>(undefined) // TODO: ensure not to show when no question is selected

let isSaved = true;
provide<boolean>('isSaved',isSaved)

// save a question to questionBank
function bufferQuestion(question_in: question)
{
  let matchInd
  if(matchInd = currQuestionBank.value.content.find((elem:question)=>elem.id === question_in.id)){
    currQuestionBank.value.content[matchInd] = structuredClone(question_in);
  }
  else currQuestionBank.value.content.push(structuredClone(question_in));
}

// save whole questionBank to localStorage
function saveData(){
  let currData = questionBankStorage.content();
  let matchInd = currData.find((elem:questionBank)=>elem.id === props.questionBank_id)
  let currQuestionBankSaved = currData[matchInd];
  currQuestionBankSaved.content = structuredClone(currQuestionBank);
  // TODO: update answerBank
  questionBankStorage.save(questionBankStorage.content())// replace this questionBank to questionBankStorage.content() and save all into it
  
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
  // TODO: append empty question,answer to questionbank,answerBank
  currQuestionBank.value.push(newQuestion);
  currAnswerBank.value.push(newAnswer)
}

// back to main interface
function backfun(){
  // TODO: 
  if(questionBankSaved)return;
  ElMessageBox.confirm('您还有未保存的更动，确定离开此界面吗？').then(()=>{
    let timer;
    timer = setTimeout(() => {
        // 动画关闭需要一定的时间
        setTimeout(() => {
          editorShowed.value = false
        }, 4000)
      }, 2000)
  })
  console.log("back hitted.")

  // 转换界面至EmptyInterface
  interfaceStorage?.setState({currentInterface:interfaces.EmptyInterface})
  // console.debug(interfaceStorage?.state.currentInterface)
}
function publishfun(){
  console.log("publish hitted.")
  if(!askSave()) return;
  emit('publish',props.questionBank_id);

  // 转换界面至MainInterface
  // console.debug(interfaceStorage?.state.currentInterface)
  return;
}
// TODO: handleClose needed: node editor close, question editor close

const handleClose = (done) => {
  if (loading.value) {
    return
  }
  ElMessageBox.confirm('Do you want to submit?')
    .then(() => {
      loading.value = true
      timer = setTimeout(() => {
        done()
        // 动画关闭需要一定的时间
        setTimeout(() => {
          loading.value = false
        }, 4000)
      }, 2000)
    })
    .catch(() => {
      // catch error
    })
}
function onSelect(question_id:string)
{
  if (!firstSelected.value) firstSelected.value = true;
  currQuestion.value = thisQuestionBank?.content.find((elem)=>elem.id === question_id) as question
  currAnswer.value = thisAnswerBank?.content.find((elem)=>elem.id === question_id) as question
}


watch(()=>props.questionBank_id,
()=>{
  // TODO: change content of questionBank Clone
}
)

// life cycle related
let thisQuestionBank:questionBank|undefined;
onBeforeMount(()=>{
  // mount questions to question list
  thisQuestionBank = questionBankStorage.content[props.questionBank];
  if(!thisQuestionBank){
    // go to previous interface

    // show error
  }
})
onMounted(()=>{
})








</script>







<style lang="css">


.left-column.large-window,.left-column.medium-window{
  width:424px;
}
.left-column.small-window{
  width: 100%;
}

.items {
  max-width: 24vx;
  min-width: 12rem;
  width: 100%;
  background: $sec;
  box-shadow: 0 3px 6px rgba(black,0.16), 0 3px 6px rgba(black,0.23);
  border-top: 10px solid $dark-pri;
}

@media(min-width: 1276px){

.back-button.large-window{
  visibility:hidden;
}
.back-button.medium-window.showing-editor, .back-button.small-window.showing-editor{
  visibility:block;
}


</style>