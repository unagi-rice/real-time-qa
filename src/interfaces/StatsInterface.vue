<!-- 界面模板 -->
<script setup lang="ts">
import { onMounted, inject } from "vue";
import InterfaceBase from "../components/InterfaceBase.vue";
import { button as button } from "../components/InterfaceBase.vue";
import { AppContext, Storage } from "@netless/window-manager";
import {
  interfaces,
  QAStorage,
  multiChoice,
  fillBlank,
  unorderedSequenceChoice,
} from "../components/Types";
import { loginTeacher, checkTeacher } from "../components/Auth";

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
    text: "stat",
    event: "stat",
  },
  {
    text: "wow",
    event: "wow",
  },
];
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage =
  inject<Storage<{ currentInterface: interfaces }>>("interface");
if (!interfaceStorage)
  throw new Error("must call provide('interface') before mount App");
console.debug(
  "EmptyInterface.vue: currentInterface =",
  interfaceStorage.state.currentInterface
);
function backfun() {
  // 转换界面至 EmptyInterface
  interfaceStorage?.setState({ currentInterface: interfaces.EmptyInterface });
  console.debug(interfaceStorage?.state.currentInterface);
}
function nextfun() {
  // 转换界面至 IndividualStatsInterface
  interfaceStorage?.setState({
    currentInterface: interfaces.IndividualStatsInterface,
  });
  console.debug(interfaceStorage?.state.currentInterface);
}
function wowfun() {
  alert("WOW!");
}

const storage = context.createStorage<QAStorage>("QAInterface");

let Answers: {
  [qid: string]: { [key: number]: string | number | number[] }[];
} = {};
// calculate stats
Object.keys(storage.state.answerBanks).map((key) => {
  const ansBank = storage.state.answerBanks[key];
  if (Answers[ansBank.qid] === undefined) Answers[ansBank.qid] = [];
  ansBank.content.map((ansBankContent) => {
    Answers[ansBank.qid].push(ansBankContent.content);
  });
});

let QAStats: {
  name: string;
  answers: { type: string; content: (string | number | number[])[] };
}[] = [];
storage.state.questionBank.content.map((qns) => {
  let QAStat: {
    name: string;
    answers: { type: string; content: (string | number | number[])[] }[];
  } = {
    name: qns.content[0].toString(),
    answers: [],
  };
  if (qns.content.length > 2) {
    qns.content.forEach((c, index) => {
      if (index === 0) return;
      QAStat.answers.push({
        type: c.type,
        content: (() => {
          let ansContent: (string | number | number[])[] = [];
          Answers[qns.id].map((ans) => {
            ansContent.push(ans[index - 1]);
          });
          return ansContent;
        })(),
      });
    });
  } else {
    QAStat.answers.push({
      type: qns.content[1].type,
      content: (() => {
        let ansContent: (string | number | number[])[] = [];
        Answers[qns.id].map((ans) => {
          ansContent.push(ans[0]);
        });
        return ansContent;
      })(),
    });
  }
});

const emit = defineEmits<{
  (e: "console-log", id: number): void;
  // usage: emit('console-log',3) to pass 3 to parent component in event 'console-log'
}>();
onMounted(() => {
  console.debug("emptyInterface.vue:title=", title);
  console.debug("emptyInterface.vue:tag=", tag);
  emit("console-log", 4);
});
const tableData = [
  {
    response: "两仪式",
  },
  {
    response: "两仪式 ❤",
  },
];
const series = [
  {
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
  },
];
const chartOptions = {
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      "两仪式",
      "两仪式 ❤",
      "两仪式 ❤❤",
      "两仪式 ❤❤❤",
      "两仪式 ❤❤❤❤",
      "两仪式 ❤❤❤❤❤",
      "两仪式 ❤❤❤❤❤❤",
      "两仪式 ❤❤❤❤❤❤❤",
      "两仪式 ❤❤❤❤❤❤❤❤",
      "两仪式 ❤❤❤❤❤❤❤❤❤",
    ],
  },
};
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
    @stat="nextfun"
    @wow="loginTeacher(context) && checkTeacher(context)"
  >
    <el-container>
      <el-row type="flex" justify="center">
        <el-space fill direction="vertical" style="width: 85%">
          <el-card
            v-for="(c, index) in QAStats"
            class="box-card"
          >
          </el-card>
          <template #header>
              <div class="card-header">
                <span>{{ c.name }}</span>
              </div>
            </template>
        </el-space>
      </el-row>
    </el-container>
    <!-- demo 
    <el-container>
      <el-row type="flex" justify="center">
        <el-space fill direction="vertical" style="width: 85%">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>题目 #1： 你的老婆是谁？</span>
              </div>
            </template>
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="response" label="Response" />
            </el-table>
          </el-card>

          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>题目 #2： 你的老婆是谁？</span>
              </div>
            </template>
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="response" label="Response" />
            </el-table>
          </el-card>
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>题目 #3： 最希望成为谁的老公 / 老婆</span>
              </div>
            </template>
            <VueApexCharts
              type="bar"
              height="350"
              :options="chartOptions"
              :series="series"
            ></VueApexCharts>
          </el-card>
        </el-space>
      </el-row>
    </el-container>
    !-->
  </InterfaceBase>
</template>
