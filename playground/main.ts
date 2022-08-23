import { createFastboard,mount,Theme } from "@netless/fastboard";
import { get_role,get_uid } from "./query";
import { registering, registering2 } from "./register";
import "./style.css";
import { roomToken } from "./token";

main().catch(console.error);

async function main() {
  await registering;
  await registering2;// HACK: delete
  const netlessRoomToken = roomToken(
    import.meta.env.VITE_AK, // 将 Your AK 替换成你从控制台获取的 AK。
    import.meta.env.VITE_SK, // 将 Your SK 替换成你从控制台获取的 SK。
    3600000, // Token 有效时间，单位为毫秒。设为 0 时，表示永不过期。
    {
      role: get_role(), // Token 的权限，可选值包括 TokenRole.Admin，TokenRole.Writer，TokenRole.Reader。
      uuid: import.meta.env.VITE_ROOM_UUID, // 填入你的房间 UUID，可通过调用服务端创建房间 API 或获取房间列表 API 获取。
    }
  );
  const fastboard = await createFastboard({
    sdkConfig: {
      appIdentifier: import.meta.env.VITE_APPID,
      region: "cn-hz",
    },
    joinRoom: {
      uid: get_uid(),
      uuid: import.meta.env.VITE_ROOM_UUID,
      roomToken: netlessRoomToken,
      isWritable: (get_role() !== "2"),
    },
  });
  const $ui = setup();

  const fastboardUI = mount(fastboard, $ui.$whiteboard);

  $ui.onReset(() => {
    fastboard.cleanCurrentScene();
    const { manager } = fastboard;
    Object.keys(manager.apps || {}).forEach(manager.closeApp.bind(manager));
  });

  $ui.onThemeChanged((theme) => fastboardUI.update({ theme }));

  expose({
    fastboard,
    room: fastboard.room,
    manager: fastboard.manager,
    ui: fastboardUI,
  });
}

/** Put some object in `window` for debugging. */
function expose(record: Record<string, any>) {
  Object.assign(window, record);
  console.debug("debug variables:", Object.keys(record).join());
}

/** Setup basic UI. */
function setup() {
  const $app = document.querySelector("#app")!;

  const $whiteboard = $app.appendChild(document.createElement("div"));
  $whiteboard.id = "whiteboard";

  const $controls = $app.appendChild(document.createElement("div"));
  $controls.id = "controls";

  const $resetBtn = $controls.appendChild(document.createElement("button"));
  $resetBtn.id = "reset";
  $resetBtn.title = "Remove all apps & Clear whiteboard";
  $resetBtn.textContent = "Reset";
  let onResetCallback: (() => void) | undefined;
  $resetBtn.onclick = () => onResetCallback && onResetCallback();

  const $themeBtn = $controls.appendChild(document.createElement("button"));
  $themeBtn.id = "theme";
  const themeCallbacks: ((theme: Theme) => void)[] = [];
  const prefersDark = matchMedia("(prefers-color-scheme: dark)");
  let theme: Theme;
  function toggleTheme(ev?: { matches: boolean }) {
    if (ev) {
      theme = ev.matches ? "dark" : "light";
    } else {
      theme = theme === "light" ? "dark" : "light";
    }
    themeCallbacks.forEach((fn) => fn(theme));
    document.documentElement.dataset.theme = theme;
    $themeBtn.textContent = theme[0].toUpperCase() + theme.slice(1);
    $themeBtn.title =
      "Click to change to " + (theme === "light" ? "dark" : "light");
  }
  toggleTheme(prefersDark);
  prefersDark.addEventListener("change", toggleTheme);
  $themeBtn.onclick = toggleTheme.bind(null, undefined);

  return {
    $whiteboard,
    onReset: (fn: () => void) => (onResetCallback = fn),
    onThemeChanged: (fn: (theme: Theme) => void) => (
      themeCallbacks.push(fn), fn(theme)
    ),
  };
}
