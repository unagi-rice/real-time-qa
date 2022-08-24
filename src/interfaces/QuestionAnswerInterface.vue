<script setup lang="ts">
import { ref, onMounted, inject, provide, defineComponent, DefineComponent, onBeforeMount, Prop, computed, h, Ref } from 'vue';
import InterfaceBase from '../components/InterfaceBase.vue'
import { button as button } from '../components/InterfaceBase.vue';
import { AppContext, Storage } from '@netless/window-manager'
import { interfaces, question as Question, questionBank as QuestionBank, defaultTestQuestionBank, answerBank as AnswerBank, multiChoice, fillBlank, unorderedSequenceChoice, initAnswerBank, answerBank } from '../components/Types';
import { checkTeacher, getUid} from '../components/Auth'
import {micromark} from 'micromark'

const buttons: button[] = [
  {
    text: '⬅',
    event: 'back'
  },
  {
    text: '➡',
    event: 'next'
  },
  {
    text: '▶',
    event: 'start'
  },
  {
    text: '⏸',
    event: 'shut'
  },
  {
     text:'⏹',
     event:'finish'
  },
]

const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage = inject<{current_interface_displayed:Ref<interfaces>,changeInterface:(next:interfaces)=>void}>("interface");
if (!interfaceStorage) throw new Error("must call provide('interface') before mount App");
console.debug(
  "QAInterface.vue: currentInterface =",
  interfaceStorage?.current_interface_displayed
);


interface Props {
  questionBank?: QuestionBank,
}

const props = withDefaults(defineProps<Props>(), {
  questionBank: () => defaultTestQuestionBank(),
});

const title = (() => {
  if (checkTeacher(context)){
    return props.questionBank.title + " (Teacher)";
  }
  else {
    return props.questionBank.title + " (Student)";
  }
})()

interface QAStorage {
  pageid: number;
  questionBank: QuestionBank;
  answerBanks: {[key: string]:AnswerBank};
  tag: string;
  allowAnswer: boolean;
}


const uid = getUid(context) as string;
const storage = (() => {
  if (checkTeacher(context)) {
    return context.createStorage<QAStorage>("QAInterface", {
    pageid: 0,
    questionBank: props.questionBank,
    answerBanks: (() => {
      let newAnswerBanks = {} as {[key: string]: AnswerBank};
      return newAnswerBanks;
    })(),
    tag: "1 / " + props.questionBank.content.length.toString(),
    allowAnswer: false})
  } else {
    const _storage = context.createStorage<QAStorage>("QAInterface");
    let tempState = structuredClone(_storage.state);
    while (tempState.questionBank === undefined) {
      tempState = structuredClone(_storage.state);
    }
    tempState.answerBanks[uid] = initAnswerBank(uid, tempState.questionBank);
    _storage.setState(tempState);
    return context.createStorage<QAStorage>("QAInterface");
  }
})()


/** reactive controling variables */
const real_pageid = ref(storage.state.pageid);
const real_ansBank = ref(storage.state.answerBanks[uid]);
const real_tag = ref(storage.state.tag);
const real_allowAns = ref(storage.state.allowAnswer);
const real_queBank = ref(storage.state.questionBank);

const pageid = computed<number>({
  get: () => real_pageid.value,
  set: (pageid) => {
    storage.setState({ 
      pageid: pageid, 
      tag: (pageid + 1).toString() + " / " + props.questionBank.content.length.toString(),
      allowAnswer: false });
    // storage.setState({tag: pageid.toString() + " / " + props.questionBank.content.length.toString()});
  },
});

const allowAns = computed<boolean>({
  get: () => real_allowAns.value,
  set: (allowAnswer) => {
    storage.setState({allowAnswer});
  }
})


/** event handler */
function backfun() {
  if (pageid.value > 0) {
    pageid.value -= 1;
    console.debug("Valid backward. PageId=", pageid)
  }
  else {
    console.debug("Invalid backward. CurId=", pageid)
    console.debug('QuestionAnswerInterface.vue.tag=', real_tag);
  }
}

function nextfun() {
  if (pageid.value < props.questionBank.content.length - 1) {
    pageid.value += 1;
    console.debug("Valid forward. PageId=", pageid)
  }
  else {
    console.debug("Invalid forward[1]. CurId=", pageid)
    console.debug('QuestionAnswerInterface.vue.tag=', real_tag);
  }
}

function startfun() {
  allowAns.value = true;
  console.log("start answering.")
  // students get questions to answer.
  // interface no more be blank.
}

function shutfun() {
  setTimeout(() => {
    allowAns.value = false;
    console.log("shut answering.")
    
  }, 1000);
  // interface returns to be blank.
}

function finishfun(){
  // TODO: send answerbank(students' responses) to ap
  if(allowAns.value)return;

  // TODO: switch to stat interface
}

onMounted(() => {
  storage.addStateChangedListener(() => {
    real_pageid.value = storage.state.pageid;
    real_tag.value = storage.state.tag;
    real_allowAns.value = storage.state.allowAnswer;
  })
  console.debug('QuestionAnswerInterface.vue.title=', title);
  console.debug('QuestionAnswerInterface.vue.title=', real_tag);
  console.debug("QAStorage", storage);
})

</script>

<template>


<div v-if="checkTeacher(context)">
  <InterfaceBase 
  :title="title" :interface_tag="real_tag" :buttons="buttons" 
  @back="backfun" @start="startfun" @shut="shutfun" @next="nextfun" @finish="finishfun"
  >
    <div v-for="(c, index) in real_queBank.content[pageid].content">
      <el-card class="box-card">
        <span v-if="typeof (c) == 'string'" v-html="micromark(c)"/>
        <el-input v-else-if="c.type === 'FillBlank'" placeholder="输入你的答案" />
        <div v-else-if="c.type === 'Multi'">
          <!-- <span>MultiChoice</span> -->
          <el-radio-group type="vertical">
            <div v-for="(cc, cidx) in (c as multiChoice).choice">
              <el-radio :label=cidx border>{{ cc }}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <div v-else-if="c.type === 'UnorderedSequence'">
          <el-checkbox-group>
            <div v-for="(cc, cidx) in (c as unorderedSequenceChoice).choice">
              <el-checkbox :label=cidx border>
                {{ cc }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </el-card>
    </div>
  </InterfaceBase>
</div>

<!-- student  -->
<div v-else-if="allowAns">
  <InterfaceBase :title="title"  :interface_tag="real_tag" >
    <div v-for="(c, index) in real_queBank.content[pageid].content">
      <el-card class="box-card">
        <span v-if="typeof (c) == 'string'" v-html="micromark(c)"/>
        <el-input v-else-if="c.type === 'FillBlank'" placeholder="输入你的答案" />
        <div v-else-if="c.type === 'Multi'">
          <el-radio-group v-model="real_ansBank.content[pageid].content[index]" type="vertical">
            <div v-for="(cc, cidx) in (c as multiChoice).choice">
              <el-radio :label=cidx border>{{ cc }}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <div v-else-if="c.type === 'UnorderedSequence'">
          <el-checkbox-group v-model="real_ansBank.content[pageid].content[index]">
            <div v-for="(cc, cidx) in (c as unorderedSequenceChoice).choice">
              <el-checkbox :label=cidx border>
                {{ cc }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </el-card>
    </div>
  </InterfaceBase>
</div>
</template>

<style>
.el-radio-group {
  display: table;
}

.el-radio {
  margin-bottom: 2px;
  width: 100%;
}

.el-checkbox-group {
  display: table;
}

.el-checkbox {
  margin-bottom: 2px;
  width: 100%;
}
</style>

