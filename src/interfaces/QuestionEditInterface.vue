
<template>

<InterfaceBase class="container" :title="title" :interface_tag="tag" :buttons="buttons" @preview="previewfun" @back="backfun" @publish="publishfun" @save="savefun">
<el-container type="common layout">
  <div id="question-list" size="100%" model-value="editingQuestion" >
    <el-card v-for="ques in questions" :key="ques.id" shadow="hover">{{ques.markdown()}}</el-card>
  </div>
  <el-drawer v-model="editorShowed" >

    <!--TODO:preset=question content, onswitch:copy content to current question, onsave:copy content from question list to question set in storage-->
    <VueEditor mode="edit" :question="question" answer="answer"/>
  </el-drawer>
</el-container>

</InterfaceBase>

</template>

<script setup lang="ts">
import { ref,onMounted,inject,provide,onBeforeMount,computed, watch } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {interfaces,question,questionBank} from '../components/Types';
import {questionBankStorage} from '../components/utils/user'
import VueEditor from '../components/editor/VueEditor.vue'
import {ElMessageBox} from 'element-plus'

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
  questionBank_id:number
}
const props = defineProps<Props>()


// App-wide variables
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage= inject<Storage<{currentInterface:interfaces}>>("interface");
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
// console.debug('QuestionEditInterface.vue: currentInterface =',interfaceStorage.state.currentInterface)

const emit = defineEmits<{
(e:'publish',id:number):void
(e:'update'):void
}>()
let isSaved = true;
provide<boolean>('isSaved',isSaved)
function saveData(){
  
  isSaved = true;
}
function askSave():boolean{
  ElMessageBox.confirm('您还有未保存的更动，确定离开此界面吗？').then((done)=>{
    let timer;
    timer = setTimeout(() => {
        // 动画关闭需要一定的时间
        setTimeout(() => {
          .value = false
        }, 4000)
      }, 2000)
  })
}

const smallWidth = 424;
const mediumWidth = 920;



// emit related
function backfun(){
  console.log("back hitted.")

  // 转换界面至EmptyInterface
  interfaceStorage?.setState({currentInterface:interfaces.EmptyInterface})
  // console.debug(interfaceStorage?.state.currentInterface)
}
function publishfun(){
  console.log("publish hitted.")
  if(!askSave()) return;
  emit('publish',props.questionBank_id);

  // 转换界面至EmptyInterface
  interfaceStorage?.setState({currentInterface:interfaces.ExampleCounter})
  // console.debug(interfaceStorage?.state.currentInterface)
  return;
}
function onSelect(question_id:string)
{
  currQuestion = 
}


watch(props.questionBank_id,
()=>{
  
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