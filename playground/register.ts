import { register, apps } from "@netless/fastboard";
import App from "../src/index";
import ExampleCounter from "../src/index2";// HACK: delete this line when submitting
import logo from "../src/logo.svg";

export const registering = register({ kind: App.kind, src: App });
export const registering2 = register({ kind: ExampleCounter.kind, src: ExampleCounter });//HACK:delete
apps.clear();
apps.push({
  kind: App.kind,
  label: App.kind.replace(/([a-z])([A-Z])/g, "$1 $2"),
  icon: logo,
  onClick: fastboard => {
    fastboard.manager.addApp({ kind: App.kind });
  },
});
apps.push({ // HACK: delete
  kind: ExampleCounter.kind,
  label: ExampleCounter.kind.replace(/([a-z])([A-Z])/g, "$1 $2"),
  icon: logo,
  onClick: fastboard => {
    fastboard.manager.addApp({ kind: ExampleCounter.kind });
  },
});
