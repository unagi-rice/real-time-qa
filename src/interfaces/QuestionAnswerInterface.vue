<script setup lang="ts">
import { ref,onMounted,inject,provide,defineComponent,DefineComponent, onBeforeMount, Prop } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import {button as button} from '../components/InterfaceBase.vue';
import {AppContext,Storage} from '@netless/window-manager'
import {interfaces,question as Question, questionBank as QuestionBank, defaultTestQuestionBank, userType} from '../components/Types';
import {getQuestionBank} from '../components/utils/user'
import { Props } from 'unist-util-is';
import { createStructuralDirectiveTransform } from '@vue/compiler-core';

const title = "Question Answering";
const tag = "tag";
const buttons:button[] = [
    {
        text:'Last Question',
        event:'back'
    },
    {
        text:'Next Question',
        event:'next'
    },
    //{
    //    text:'Finish Answering',
    //    event:'finish'
    //},
]

const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage= inject<Storage<{currentInterface:interfaces}>>("interface");
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
console.debug(
    "EmptyInterface.vue: currentInterface =",
    interfaceStorage.state.currentInterface
);

const props = withDefaults(defineProps<Props>(), {
  questionBank: () => defaultTestQuestionBank(), 
  curId: () => 0,
  preview: () => false
});



function backfun(this: any){
    if (this.curId > 0) {
        this.curId -= 1;
    }
    else {
        console.debug("Invalid backward. CurId=", this.curId)
    }
}

function nextfun(this: any) {
    if (this.curId < this.questionBank.content.length) {
        this.curId += 1;
    }
    else {
        console.debug("Invalid forward[1]. CurId=", this.curId)
        console.debug("Invalid forward[2]. CurId=", this.curId)
    }
}

function finishfun() {
    console.log("finish answering.")
    interfaceStorage?.setState({})
}
onMounted(()=>{
    console.debug('QuestionAnswerInterface.vue.title=', title);
    console.debug('QuestionAnswerInterface.vue.title=', tag);
})

</script>

<template>

<InterfaceBase
        :title="title" 
        :interface_tag="tag" 
        :buttons="buttons" @back="backfun" @next="nextfun" @wow="loginTeacher(context) && checkTeacher(context)">
<!--
<el-container>

    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>question.</span>
            </div>
        </template>
    </el-card>
    
</el-container>
-->
</InterfaceBase>
</template>