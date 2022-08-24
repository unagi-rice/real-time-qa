<!-- 界面模板 -->
<script setup lang="ts">
import { onMounted, inject, Ref } from "vue";
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

import VueApexCharts from "vue3-apexcharts";
// import { emitter } from '@netless/window-manager/dist/InternalEmitter';

const title = "Stats Interface";
const tag = "tag";
const buttons: button[] = [
  {
    text: "主页面",
    event: "main",
  },
  {
    text: "stat",
    event: "stat",
  },
];
const context = inject<AppContext>("context");
if (!context) throw new Error("must call provide('context') before mount App");
const interfaceStorage = inject<{
  current_interface_displayed: Ref<interfaces>;
  changeInterface: (next: interfaces) => void;
}>("interface");
if (!interfaceStorage)
  throw new Error("must call provide('interface') before mount App");
console.debug(
  "EmptyInterface.vue: currentInterface =",
  interfaceStorage?.current_interface_displayed.value
);
function mainfun() {
  // 转换界面至 EmptyInterface
  interfaceStorage?.changeInterface(interfaces.EmptyInterface);
  console.debug(interfaceStorage?.current_interface_displayed.value);
}
function nextfun() {
  // 转换界面至 IndividualStatsInterface
  interfaceStorage?.changeInterface(interfaces.IndividualStatsInterface);
  console.debug(interfaceStorage?.current_interface_displayed.value);
}
function wowfun() {
  alert("WOW!");
}

const storage = context.createStorage<QAStorage>("QAInterface");
if (Object.keys(storage.state.answerBanks).length === 0) {
  alert("无作答记录");
  interfaceStorage?.changeInterface(interfaces.MainInterface);
}

let Answers: {
  [qid: string]: { [key: number]: string | number | number[] }[];
} = {};
// calculate stats
console.log(storage.state.answerBanks);
Object.keys(storage.state.answerBanks).map((key) => {
  const ansBank = storage.state.answerBanks[key];
  if (Answers[ansBank.qid] === undefined) Answers[ansBank.qid] = [];
  ansBank.content.map((ansBankContent) => {
    Answers[ansBank.qid].push(ansBankContent.content);
  });
});

interface tableData {
  response: string;
}

interface chartSeries {
  data: number[];
}

interface chartOptions {
  chart: {
    type: string; // default "bar"
    height: number; // default 350
  };
  plotOptions: {
    bar: {
      borderRadius: number; // default 4
      horizontal: boolean; // default true
    };
  };
  dataLabels: {
    enabled: boolean; // default false
  };
  xaxis: {
    categories: string[]; // choices
  };
}

let defaultChartOptions: chartOptions = {
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
    categories: [],
  },
};

interface Stats {
  name: string;
  answers: {
    type: string;
    content: tableData[] | chartSeries[];
    chartOptions?: chartOptions | null;
  }[];
}

let QAStats: Stats[] = [];
storage.state.questionBank.content.map((qns) => {
  let QAStat: Stats = {
    name: qns.content[0].toString(),
    answers: [],
  };
  qns.content.forEach((c, index) => {
    if (index === 0) return;
    QAStat.answers.push({
      type: typeof c.type,
      content: (() => {
        if (typeof c.type === "FillBlank") {
          let ansContent: tableData[] = [];
          Answers[qns.id].map((ans) => {
            ansContent.push({ response: ans[index - 1] });
          });
          return ansContent;
        } else if (typeof c.type === "Multi") {
          let ansContent: chartSeries = {
            data: Array.apply(null, Array(Object.keys(c.choice).length)).map(
              (x, i) => 0
            ),
          };
          Answers[qns.id].map((ans) => {
            ansContent.data[ans[index - 1]] += 1;
          });
          return [[ansContent]];
        } else if (typeof c.type === "UnorderedSequence") {
          let ansContent: chartSeries = {
            data: Array.apply(null, Array(Object.keys(c.choice).length)).map(
              (x, i) => 0
            ),
          };
          Answers[qns.id].map((ans) => {
            ans[index - 1].map((multi) => {
              ansContent.data[multi] += 1;
            });
          });
          return [ansContent];
        }
      })(),
      chartOptions: (() => {
        if (typeof c.type !== "Multi" || typeof c.type !== "UnorderedSequence")
          return null;
        let cOpt: chartOptions = { ...defaultChartOptions };
        c.choice.map((choice) => {
          cOpt.xaxis.categories.push(choice);
        });
        return cOpt;
      })(),
    });
  });
  QAStats.push(QAStat);
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
</script>

<!--定义展示的模块-->
<template>
  <InterfaceBase
    :title="title"
    :interface_tag="tag"
    :buttons="buttons"
    @main="mainfun"
    @stat="nextfun"
  >
    <el-container>
      <el-row type="flex" justify="center">
        <el-space fill direction="vertical" style="width: 85%">
          <el-card v-for="(c, index) in QAStats" class="box-card">
            <template #header>
              <div class="card-header">
                <span>{{ c.name }}</span>
              </div>
            </template>
            <div v-for="(cc, cidx) in QAStats.answers">
              <el-table
                v-if="cc.type === 'FillBlank'"
                :data="cc.content"
                stripe
                style="width: 100%"
              >
                <el-table-column prop="response" label="Response" />
              </el-table>
              <VueApexCharts
                v-else-if="
                  cc.type === 'Multi' || cc.type === 'UnorderedSequence'
                "
                type="bar"
                height="350"
                :options="cc.chartOptions"
                :series="cc.content"
              ></VueApexCharts>
            </div>
          </el-card>
        </el-space>
      </el-row>
    </el-container>
  </InterfaceBase>
</template>
