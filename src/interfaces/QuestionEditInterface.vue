<template>

<InterfaceBase class="container" :title="title" :interface_tag="tag" :buttons="buttons" @preview="previewfun" @back="backfun" @publish="publishfun" @save="savefun">
<el-container type="common layout">
<Transition>
  <div id="list-container" v-show="largeWindow || !editingQuestion" >
    <el-card v-for="ques in questions" shadow="hover">{{ques.markdown()}}</el-card>
  </div>
</Transition>
<!--TODO:preset=question content, onswitch:copy content to current question, onsave:copy content from question list to question set in storage-->
<VueEditor :editor="editor" :modelValue="question"/>
</el-container>

</InterfaceBase>
<Teleport :to="body" >
<div :v-if="openPreview">
  <AnsweringNodeVue :class="{active:showPreview}" :question="rippedQuestion" @made-response="handleResponse"/>
  <button @click="openPreview = false;" >Close</button>
</div>
</Teleport>
</template>

<script setup lang="ts">
import { ref,onMounted,inject,provide,defineComponent,DefineComponent, onBeforeMount } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {interfaces,question,questionBank,userType} from '../components/Types';
import {getQuestionBank} from '../components/utils/user'



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







<style lang="scss">
$pri: #128CFC;
$sec: #fffffe;
$dark-pri: #0B5AA2;
* {
  box-sizing: border-radius;
}
.list-container {
  border: 1px solid black;
  
  height:100%;
  position: relative;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: auto;
  
  display: grid;
  place-items: center;
  background-color: $pri;
}




</style>