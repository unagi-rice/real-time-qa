<template>

<InterfaceBase class="container" :title="title" :interface_tag="tag" :buttons="buttons" @preview="previewfun" @back="backfun" @publish="publishfun" @save="savefun">
<el-container type="common layout">

</el-container>
</div>
<!--TODO:preset=question content, onswitch:copy content to current question, onsave:copy content from question list to question set in storage-->
<VueEditor :editor="editor"/>

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
/*TODO:
Milkdown | Commands
https://milkdown.dev/commands#example-command-without-argument

Milkdown | plugin-menu
https://milkdown.dev/plugin-menu

[Milkdown] editor Integration Guide
https://programming.vip/docs/milkdown-editor-integration-guide.html

ProseMirror Reference manual
https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews

ProseMirror Reference manual
https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews

*/


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
}>() // TODO: back to main menu, publish
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
  // font-family: 'Rubik', sans-serif;
}
.container {
  border: 1px solid black;
  
  height:100%;
  position: relative;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: auto;
  
  display: grid;
  place-items: center;
  background-color: $pri;
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

  .items {
    
  }
}

.items-head p{
  padding: 5px 20px;
  margin: 10px;
  color: #0B5AA2;
  font-weight: bold;
  font-size: 20px;
}

.items-head hr {
  width: 20%;
  margin: 0px 30px;
  border: 1px solid $dark-pri;
}

.items-body {
  padding: 10px;
  margin: 10px;
  display: grid;
  grid-gap: 10px;
}

.items-body-content {
  padding: 10px;
  padding-right: 0px;
  display: grid;
  grid-template-columns: 10fr 1fr;
  // background-color: lightblue;
  font-size: 13px;
  grid-gap: 10px;
  border: 1px solid transparent;
  cursor: pointer;
  
}

.items-body-content:hover {
  border-radius: 3px;
  border: 1px solid $dark-pri;
}

.items-body-content i {
  align-self: center;
  font-size: 15px;
  color: $dark-pri;
  font-weight: bold;
  animation: icon 1.5s infinite forwards;
}

@keyframes icon {
  0%,100%{
    transform: translate(0px);
  }
  50% {
    transform: translate(3px);
  }
}

</style>