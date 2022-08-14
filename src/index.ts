import type { NetlessApp } from "@netless/window-manager";

import { createApp ,computed} from "vue";
import styles from "./style.css?inline";
import App from "./components/App.vue";
import {loginTeacher, checkTeacher} from "./components/Auth";

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
    const isTeacher = computed(()=>(loginTeacher(context) && checkTeacher(context)))
    if(isTeacher.value){

      box.mountStyles(styles);// TODO:move login to here
      
      const $content = document.createElement("div");
      $content.className = "app-real-time-qa";
      box.mountContent($content);
      
      const app = createApp(App).provide("context", context);
      
      app.mount($content);
      
      context.emitter.on("destroy", () => {
        app.unmount();
      });
    }
  },
};

export default RealTimeQA;
