<!--  -->
<script setup lang="ts">
import { ref, onMounted, inject, Ref } from "vue";
import InterfaceBase from "../components/InterfaceBase.vue";
import { button as button } from "../components/InterfaceBase.vue";
import { AppContext, Storage } from "@netless/window-manager";
import {
  interfaces,
  QAStorage,
  multiChoice,
  unorderedSequenceChoice,
} from "../components/Types";

import VueApexCharts from "vue3-apexcharts";
// import { emitter } from '@netless/window-manager/dist/InternalEmitter';

const title = "Stats Interface";
const tag = "tag";
const buttons: button[] = [
  {
    text: "主页面",
    event: "back",
  },
  {
    text: "next",
    event: "next",
  },
  {
    text: "wow",
    event: "wow",
  },
];
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage =
  inject<{current_interface_displayed:Ref<interfaces>,changeInterface:(next:interfaces)=>void}>("interface");
if (!interfaceStorage)
  throw new Error("must call provide('interface') before mount App");
console.debug(
  "EmptyInterface.vue: currentInterface =",
  interfaceStorage?.current_interface_displayed
);
function backfun() {
  // 转换界面至 StatsInterface
  interfaceStorage?.changeInterface(interfaces.StatsInterface );
  console.debug(interfaceStorage?.current_interface_displayed);
}
function nextfun() {
  // 转换界面至 IndividualStatsInterface
  interfaceStorage?.changeInterface( interfaces.IndividualStatsInterface);
  console.debug(interfaceStorage?.current_interface_displayed);
}


const emit = defineEmits<{
  (e: "console-log", id: number): void;
  // usage: emit('console-log',3) to pass 3 to parent component in event 'console-log'
}>();
onMounted(() => {
  console.debug("emptyInterface.vue:title=", title);
  console.debug("emptyInterface.vue:tag=", tag);
  emit("console-log", 4);
});

let pageId = ref(0);
const storage = context.createStorage<QAStorage>("QAInterface");
let userUID = ref("");
const usersUID = Object.keys(storage.state.answerBanks);

const inputQns1 = "两仪式";
</script>

<!--定义展示的模块-->
<template>
  <!--     
需要至少传入：title（界面标题，预计用来展示题集名字）
传入
@back, @next为以上buttons中所定义的事件event，backfun、nextfun为事件的处理函数
-->
  <InterfaceBase
    :title="title"
    :interface_tag="tag"
    :buttons="buttons"
    @back="backfun"
    @next="nextfun"
  >
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <el-select
          v-model="userUID"
          class="m-2"
          placeholder="User"
          size="default"
        >
          <el-option
            v-for="item in usersUID"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :span="12">
        <div class="slider-demo-block">
          <el-slider v-model="value" show-input />
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-space fill direction="vertical" style="width: 85%">
        <el-card
          :key="userUID"
          v-for="(c, idx) in storage.state.questionBank.content[pageId].content"
          class="box-card"
        >
          <template v-if="typeof c === 'string'" #header>
            <div class="card-header">
              <span>{{ c }}</span>
            </div>
          </template>
          <el-input
            v-if="typeof c === 'FillBlank'"
            v-model="
              storage.state.answerBanks[userUID].content[pageId].content[idx]
            "
            readonly
          />
          <div
            v-if="typeof c === 'Multi' || typeof c === 'UnorderedSequence'"
            style="text-align: center; display: block"
          >
            <el-radio-group
              v-if="typeof c === 'Multi'"
              v-model="
                storage.state.answerBanks[userUID].content[pageId].content[idx]
              "
              class="radioDiv"
              disabled
            >
              <div v-for="(cc, cidx) in (c as multiChoice).choice">
                <el-checkbox :label="cidx" size="large">
                  {{ cc }}
                </el-checkbox>
              </div>
            </el-radio-group>
            <el-checkbox-group
              v-else-if="c.type === 'UnorderedSequence'"
              v-model="storage.state.answerBanks[userUID].content[pageId].content[idx]"
            >
              <div v-for="(cc, cidx) in (c as unorderedSequenceChoice).choice">
                <el-checkbox :label="cidx">
                  {{ cc }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </el-card>
      </el-space>
    </el-row>
  </InterfaceBase>
</template>

<style scoped>
.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 15px;
}
.radioDiv {
  display: table;
  width: auto;
  margin: 0 auto;
  text-align: left;
}
</style>
