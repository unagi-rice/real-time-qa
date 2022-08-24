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


.full-fit-size{
  height:100%;
  width:100%;
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
  flex-grow: 2;
  color:#ffffff;
  max-width:70%;
  height: 100%;
}
.interface-tag{
  text-align: right;
  flex-grow: 2;
  /* background-color:#ffffff; */
  color:#ffffff;
  max-width: 100%;
  height: 100%;
}

.el-button{
  background-color:#768d87;
  -webkit-border-radius:28px;
  -moz-border-radius:28px;
  border-radius:28px;
  border:1px solid #566963;
  display:inline-block;
  cursor:pointer;
  color:#ffffff;
  font-size:13px;

  /* margin:0.5em 1em; */
  padding:0.5em 1em;
  text-decoration:none;
  text-shadow:-3px -3px 50px #2b665e;
}
.title-container > div{
  padding:15px 30px;
}
.page-header > button{
  margin:15px 0px;
}
*{
  font-family: 'PingFang SC';
}
.el-header,.el-main{
  padding:0 6px 0 0;
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
  <el-main >
    <slot/>
  </el-main>
</el-container>
</template>