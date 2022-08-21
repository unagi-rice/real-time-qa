<!-- 
when larger than large: list && editor
large <= size <= small: list fixed width, hide on select, show on editor.back
      editor width:100% on select
size < small: list 100%,  hide on select, show on editor.back
      editor width:100% on select

usable property: element.clientWidth
https://www.w3schools.com/jsref/dom_obj_all.asp
https://element-plus.org/en-US/component/drawer.html
 -->
<template>

<InterfaceBase class="container" :title="title" :interface_tag="tag" :buttons="buttons" @preview="previewfun" @back="backfun" @publish="publishfun" @save="savefun">
<el-container type="common layout">
  <el-drawer id="question-list" v-show="largeWindow || !editingQuestion" >
    <el-card v-for="ques in questions" :key="ques.id" shadow="hover">{{ques.markdown()}}</el-card>
  </el-drawer>
<!--TODO:preset=question content, onswitch:copy content to current question, onsave:copy content from question list to question set in storage-->
<VueEditor :modelValue="question"/>
</el-container>

</InterfaceBase>

</template>

<script setup lang="ts">
import { ref,onMounted,inject,provide,onBeforeMount,computed } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {interfaces,question,questionBank,userType} from '../components/Types';
import {getQuestionBank} from '../components/utils/user'
import VueEditor from '../components/editor/VueEditor.vue'


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
  title: string
  id:string
  interface_tag ?: string
  buttons?:button[]
}
const props = defineProps<Props>()


// App-wide variables
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage= inject<Storage<{currentInterface:interfaces}>>("interface");
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
// console.debug('QuestionEditInterface.vue: currentInterface =',interfaceStorage.state.currentInterface)
const userStorage = inject<Storage<userType>>("userStorage")

const emit = defineEmits<{
(e:'publish',id:string):void
(e:'back'):void
}>()
//http://localhost:4896/?role=admin&uid=tore1umkvvo
let isSaved = true;
provide<boolean>('isSaved',isSaved)
function saveData(){
  userStorage.questions[props.id] = modifiedQuestionBank;
  isSaved = true;
}
function askSave():boolean{
  return isSaved || window.confirm('您还有未保存的更动，确定离开此界面吗？');
}

const smallWidth = 424;
const mediumWidth = 920;
const smallWindow = computed(()=>{
  const currentWindowWidth = document.querySelector('div.app-real-time-qa')?.clientWidth;
  if(currentWindowWidth !== undefined){
    return currentWindowWidth < smallWidth;
  }
  throw Error('app window not found');
})
const largeWindow = computed(()=>{
  const currentWindowWidth = document.querySelector('div.app-real-time-qa')?.clientWidth;
  if(currentWindowWidth !== undefined){
    return currentWindowWidth > mediumWidth;
  }
  throw Error('app window not found');
})


// emit related
function backfun(){
  console.log("back hitted.")

  // 转换界面至EmptyInterface
  interfaceStorage?.setState({currentInterface:interfaces.EmptyInterface})
  // console.debug(interfaceStorage?.state.currentInterface)
}
function publishfun(){
  console.log("publish hitted.")
  emit('publish',props.id);
  if(!askSave()) return;

  // 转换界面至EmptyInterface
  interfaceStorage?.setState({currentInterface:interfaces.ExampleCounter})
  // console.debug(interfaceStorage?.state.currentInterface)
  return;
}


// life cycle related
let thisQuestionBank:questionBank|undefined;
onBeforeMount(()=>{
  // mount questions to question list
  thisQuestionBank = getQuestionBank(props.id);
  if(!thisQuestionBank){
    // go to previous interface
    // show error
  }
})
onMounted(()=>{
})

let openPreview = false;


function handleResponse(response:any){
  console.log('response received:',response);
}





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