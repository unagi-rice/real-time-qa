<!-- 界面模板 -->
<script setup lang="ts">
import { onMounted, inject } from "vue";
import InterfaceBase from "../components/InterfaceBase.vue";
import { button as button } from "../components/InterfaceBase.vue";
import { AppContext, Storage } from "@netless/window-manager";
import { interfaces } from "../components/Types";
import { loginTeacher, checkTeacher } from "../components/Auth";

import VueApexCharts from "vue3-apexcharts";
// import { emitter } from '@netless/window-manager/dist/InternalEmitter';

const title = "Stats Interface";
const tag = "tag";
const buttons: button[] = [
  {
    text: "back",
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
  // 转换界面至EmptyInterface
  interfaceStorage?.setState({ currentInterface: interfaces.EmptyInterface });
  console.debug(interfaceStorage?.state.currentInterface);
}
function nextfun() {
  // 转换界面至ExampleCounter
  interfaceStorage?.setState({ currentInterface: interfaces.ExampleCounter });
  console.debug(interfaceStorage?.state.currentInterface);
}
function wowfun() {
  alert("WOW!");
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
  </InterfaceBase>
</template>
