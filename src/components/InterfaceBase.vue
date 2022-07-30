<script setup lang="ts">
import { stringify } from 'uuid';
import { onMounted } from 'vue';
import * as Auth from './Auth';
export interface button{
      // id:number
      text:string
      event:string
      handler?:string
    }

interface Props{
  title: string
  interface_tag ?: string
  buttons?:button[]
}
const props = defineProps<Props>()
onMounted(()=>{
  console.log('InterfaceBase:title=',props.title);
  console.log('InterfaceBase:tag=',props.interface_tag);
  }
)

// Expose API to 
</script>
<style>
/*TODO: page-header,page-main running out of plugin window*/
.grid {
  height:inherit;
  width:inherit;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto minmax(160px, auto);
  grid-template-areas: 
  'header'
  'main';
  column-gap: 37px;
  row-gap: 37px;
}

.page-header {
  height:inherit;
  width:inherit;
  grid-area: header;
  display:flex
}

.page-leftbar {
  grid-area: leftbar;
}

.page-main {
  height:inherit;
  width:inherit;
  grid-area: main;
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
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
  margin: 0px -10px;
}
.title
{
  background-color:#00ffbb;
  
}
.tag{
  background-color:#ffbb00;
  
}
.button-container{

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
<div class="grid">
  <div class="page-header">
    <div class="title">
      {{props.title}}
    </div>
    <div class="interface-tag">
      {{props.interface_tag}}
    </div>
    <div class="button-container flexbox">
      <a href="#" class="button" v-for="button in props.buttons" @button.event="button.handler">{{button.text}}</a>
    </div>
  </div>
  <div class="page-main">
    <slot/>
  </div>
</div>
</template>