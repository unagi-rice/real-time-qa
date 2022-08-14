<script setup lang="ts">
import { stringify } from 'uuid';
import { onMounted } from 'vue';
import * as Auth from './Auth';
export interface button{
      // id:number
      text:string
      event:string
      // handler?:string
    }

interface Props{
  title: string
  interface_tag ?: string
  buttons?:button[]
}
const props = defineProps<Props>()
onMounted(()=>{
  // console.log('InterfaceBase:title=',props.title);
  // console.log('InterfaceBase:tag=',props.interface_tag);
})

// Expose API to 
</script>
<style>

/* TODO: fit title bar to whole window; spread title , tag , buttons evenly */
.grid {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto minmax(160px, auto);
  grid-template-areas: 
  'header'
  'main';
  column-gap: 37px;
  row-gap: 0px;
}
.full-fit-size{
  height:100%;
  width:100%;
}

.page-header {
  grid-area: header;

}

.page-leftbar {
  grid-area: leftbar;
}

.page-main {
  height:100%;
  width:100%;
  grid-area: main;
}
.header-background {
  background-color: #2b665e;
}

.content {
  color: #242424;
  background-color: #ffffff;
  font-weight: 600;
  text-align: center;
  box-sizing: border-box;
  height: 100%;
  padding: 10px;
}
.flexbox{
    display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-start;
  box-sizing: border-box;
}
.flexbox-right{
  justify-content: right;
}
.title-container{
  
  flex-grow: 3;
}
.title
{
  text-align: left;
  flex-grow: 3;
  color:#ffffff;
  max-width:90%;
  height: 100%;
}
.interface-tag{
  text-align: right;
  flex-grow: 1;
  /* background-color:#ffffff; */
  color:#ffffff;
  max-width:10%;
  height: 100%;
  
  
}

el-button{
  background-color:#768d87;
  -webkit-border-radius:28px;
  -moz-border-radius:28px;
  border-radius:28px;
  border:1px solid #566963;
  display:inline-block;
  cursor:pointer;
  color:#ffffff;
  font-size:17px;

  /* margin:0.5em 1em; */
  padding:0.5em 1em;
  text-decoration:none;
  text-shadow:-3px -3px 50px #2b665e;
}
.button:hover {
  background-color:#6c7c7c;
}
.button:active {
  position:relative;
  top:1px;
}
.title-container > div{
  padding:15px 31px;
}
.page-header > button{
  margin:15px 0px;
}
*{
  font-family: 'PingFang SC';
}
</style>
<template>
<el-container type="common-layout" class="full-fit-size ">
  <el-header>
    <div class="page-header flexbox header-background">
      <div class="title-container flexbox flexbox-right">
        
        <div class="title">{{props.title}}</div>
      <div class="interface-tag">{{props.interface_tag}}</div>
      </div>
        <el-button type="primary" class="button" v-for="button in props.buttons" @click="$emit(button.event)">{{button.text}}
        </el-button>
    </div>
  </el-header>
  <el-main class="page-main">
    <slot/>
  </el-main>
</el-container>
</template>