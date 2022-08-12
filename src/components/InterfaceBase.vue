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
  }
)

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
.inherit-size{
  height:inherit;
  width:inherit;
}

.page-header {
  grid-area: header;
}

.page-leftbar {
  grid-area: leftbar;
}

.page-main {
  height:inherit;
  width:inherit;
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
  margin: 0px -10px;
}
.flexbox-right{
  justify-content: right;
}
.title
{
  background-color:#00ffbb;
  color:#ffffff;
}
.tag{
  background-color:#ffbb00;
  color:#ffffff;
  padding:15px 31px;
  
}
.button-container{
float:right
}
.button {
  background-color:#768d87;
  -webkit-border-radius:28px;
  -moz-border-radius:28px;
  border-radius:28px;
  border:1px solid #566963;
  display:inline-block;
  cursor:pointer;
  color:#ffffff;
  font-family:Verdana;
  font-size:17px;
  padding:15px 31px;
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
</style>
<template>
<div class="inherit-size grid">
  <div class="page-header flexbox header-background">
    <div class="title">
      {{props.title}}
    </div>
    <div class="interface-tag">
      {{props.interface_tag}}
    </div>
    <div class="button-container flexbox flexbox-right">
      <a href="#" class="button" v-for="button in props.buttons" @click="$emit(button.event)">{{button.text}}</a>
    </div>
  </div>
  <div class="page-main">
    <slot/>
  </div>
</div>
</template>