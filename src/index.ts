import type { NetlessApp } from "@netless/window-manager";

import { createApp ,computed} from "vue";
import styles from "./style.css?inline";
import App from "./components/App.vue";
import AppStudent from "./components/AppStudent.vue";
import {loginTeacher, checkTeacher} from "./components/Auth";
import {interfaces} from "./components/Types"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/**
 * Register it before joining room:
 * ```js
 * WindowManager.register({
 *   kind: "Counter",
 *   src: Counter
 * })
 * ```
 * Then you can use it in your room:
 * ```js
 * manager.addApp({ kind: 'Counter' })
 * ```
 * Read more about how to make a netless app here:
 * https://github.com/netless-io/window-manager/blob/master/docs/develop-app.md
 */
const RealTimeQA: NetlessApp = {
  kind: "RealTimeQA",
  config:{
    singleton : true,
    minwidth : 400,
    minheight : 200,
  },
  setup(context) {
    const box = context.getBox();
    const isTeacher = computed(()=>{loginTeacher(context);return checkTeacher(context)})


    // potential change: let 
    if(isTeacher.value){
      
      box.mountStyles(styles);
      
      const $content = document.createElement("div");
      $content.className = "app-real-time-qa";
      box.mountContent($content);
      
      const app = createApp(App).provide("context", context);
      
      for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
      }

      app.mount($content);
      
      context.emitter.on("destroy", () => {
        app.unmount();
      });
    } else {
      
      box.mountStyles(styles);

      const $content = document.createElement("div");
      $content.className = "app-real-time-qa";
      box.mountContent($content);

      const app = createApp(AppStudent).provide("context", context);

      for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
      }
      
      app.mount($content);

      context.emitter.on("destroy", () => {
        app.unmount();
      });
    }
  },
};



export default RealTimeQA;
