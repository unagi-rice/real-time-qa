<script lang="ts" setup>
// dependencies
import { AppContext ,Storage} from "@netless/window-manager";
import { computed, inject, onBeforeMount, onMounted, provide, Ref, ref, watchEffect } from "vue";
import {loginTeacher, checkTeacher} from "./Auth";
import {interfaces, questionBank} from "./Types"

// interfaces
import EmptyInterface from "../interfaces/EmptyInterface.vue";
import ExampleCounter from "../interfaces/ExampleCounter.vue";
import StatsInterface from "../interfaces/StatsInterface.vue";
import MainInterface from "../interfaces/MainInterface.vue";
import IndividualStatsInterface from "../interfaces/IndStatsInterface.vue";
import QuestionAnswerInterface from "../interfaces/QuestionAnswerInterface.vue";
import QuestionEditInterface from "../interfaces/QuestionEditInterface.vue";
import { questionBankStorage } from "./utils/user";


// app-wide context
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const $globVar = ref({})

const current_interface_displayed = ref(interfaces.MainInterface);
function changeInterface(next:interfaces){
  current_interface_displayed.value = next;
}
provide("interface",{
  current_interface_displayed,
  changeInterface,
  })
// const current_interface_displayed = ref(interfaces.MainInterface);

// inter-interface variables
const currQuestionBankID = ref('')
const currQuestionBank = ref<questionBank>({id:'',title:'',content:[],})

const isTeacher = computed(()=>{loginTeacher(context);return checkTeacher(context)})
console.debug('App.vue: isTeacher?',isTeacher.value)


onMounted(() =>{
  // initialize currQuestionBankID

});




// emit handler
function consoleLog(s:number){console.log(s);}
function onPublish(questionBankID:questionBank["id"]){
  currQuestionBank.value = ((questionBankStorage.content() as questionBank[]).find((elem)=>elem.id === questionBankID)) as questionBank
  // current_interface_displayed.value = interfaces.QuestionAnswerInterface;
}
function onEdit(questionBankID:questionBank["id"]){
  currQuestionBankID.value = questionBankID;
  currQuestionBank.value = ((questionBankStorage.content() as questionBank[]).find((elem)=>elem.id === questionBankID)) as questionBank
}

</script>
<template v-if="isTeacher">
<!-- NOTICE: list out interfaces and their props, emitters -->
<MainInterface v-if="current_interface_displayed == interfaces.MainInterface" @edit="onEdit" @publish="onPublish"/>
<StatsInterface v-if="current_interface_displayed == interfaces.StatsInterface"/>
<IndividualStatsInterface v-if="current_interface_displayed == interfaces.IndividualStatsInterface"/>
<QuestionAnswerInterface v-if="current_interface_displayed == interfaces.QuestionAnswerInterface" :questionBank="currQuestionBank"/>
<QuestionEditInterface v-if="current_interface_displayed == interfaces.QuestionEditInterface" :questionBank_id="currQuestionBankID" @publish="onPublish"/>
</template>
<style>

@import "@material-design-icons/font/outlined.css";
</style>