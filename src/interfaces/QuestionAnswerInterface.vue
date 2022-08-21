<script setup lang="ts">
import { ref, onMounted, inject, provide, defineComponent, DefineComponent, onBeforeMount, Prop, computed, h } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import { button as button } from '../components/InterfaceBase.vue';
import { AppContext, Storage } from '@netless/window-manager'
import { interfaces, question as Question, questionBank as QuestionBank, defaultTestQuestionBank, userType, objectiveQuestionType, answerBank as AnswerBank, multiChoice, fillBlank, unorderedSequenceChoice, initAnswerBank} from '../components/Types';
import { loginTeacher, checkTeacher, getUid } from '../components/Auth'
import { v1 as getuuid } from 'uuid'
import { getQuestionBank } from '../components/utils/user'
import { Props } from 'unist-util-is';
import { createStructuralDirectiveTransform } from '@vue/compiler-core';
import VueApexCharts from 'vue3-apexcharts';
import { method } from 'lodash';
import { init } from '../components/editor/CustomNode/shim';

const title = "Question Answering";
const tag = "tag";
const buttons: button[] = [
    {
        text: 'Last Question',
        event: 'back'
    },
    {
        text: 'Next Question',
        event: 'next'
    },
    //{
    //    text:'Finish Answering',
    //    event:'finish'
    //},
]

const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage = inject<Storage<{ currentInterface: interfaces }>>("interface");
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
console.debug(
    "EmptyInterface.vue: currentInterface =",
    interfaceStorage.state.currentInterface
);

export interface Props {
    questionBank?: QuestionBank,
    preview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    questionBank: () => defaultTestQuestionBank(),
    preview: () => false
});


interface QAStorage {
    pageid: number;
    answerBank: AnswerBank;
}

const storage = context.createStorage<QAStorage>("QAInterface", { pageid: 0, answerBank:initAnswerBank(getUid(context), props.questionBank)})
const real_pageid = ref(storage.state.pageid);
const real_ansBank = ref(storage.state.answerBank);

const pageid = computed<number>({
    get: () => real_pageid.value,
    set: (pageid) => storage.setState({ pageid }),
});


function backfun() {
    if (pageid.value > 0) {
        pageid.value -= 1;
        console.debug("Valid backward. PageId=", pageid)
    }
    else {
        console.debug("Invalid backward. CurId=", pageid)
    }
}

function nextfun() {
    if (pageid.value < props.questionBank.content.length - 1) {
        pageid.value += 1;
        console.debug("Valid forward. PageId=", pageid)
    }
    else {
        console.debug("Invalid forward[1]. CurId=", pageid)
        console.debug("Invalid forward[2]. CurId=", pageid)
    }
}

function finishfun() {
    console.log("finish answering.")
    interfaceStorage?.setState({})
}
onMounted(() => {
    storage.addStateChangedListener(() => {
        real_pageid.value = storage.state.pageid;
    })
    console.debug('QuestionAnswerInterface.vue.title=', title);
    console.debug('QuestionAnswerInterface.vue.title=', tag);
})

</script>

<template>

    <InterfaceBase :title="title" :interface_tag="tag" :buttons="buttons" @back="backfun" @next="nextfun"
        @wow="loginTeacher(context) && checkTeacher(context)">
        <div v-for="(c, index) in props.questionBank.content[pageid].content">
            <el-card class="box-card">
                <div v-if="typeof (c) == 'string'">
                    <span>{{ c }}</span>
                </div>
                <div v-if="c instanceof multiChoice">
                    <el-radio-group v-model="real_ansBank.content[pageid].content[index]" type="vertical">
                        <div v-for="(cc, cidx) in (c as multiChoice).choice">
                            <el-radio :label=cidx border>{{ cc }}</el-radio>
                        </div>
                    </el-radio-group>
                </div>
                <div v-if="c instanceof fillBlank">
                    <el-input v-model="real_ansBank.content[pageid].content[index]" placeholder="输入你的答案"/>
                </div>
                <div v-if="c instanceof unorderedSequenceChoice">
                    <el-checkbox-group v-model="real_ansBank.content[pageid].content[index]">
                        <div v-for="(cc, cidx) in (c as unorderedSequenceChoice).choice">
                            <el-checkbox :label=cidx>
                                {{cc}}
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </div>
            </el-card>
        </div>
    </InterfaceBase>
</template>
