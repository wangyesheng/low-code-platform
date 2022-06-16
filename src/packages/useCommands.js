import deepcopy from "deepcopy";
import { onUnmounted } from "vue";
import { events } from "./event";

export function useCommands(settings) {
  const state = {
    current: -1, // 前进后退的索引值
    queue: [], // 所有的操作指令
    commandsMap: {}, // 操作指令和执行功能的映射表 { ctrlZ: ()=>{}, redo: ()=>{} }
    commands: [], // 所有的命令
    destories: [], // 卸载函数
  };

  const register = (command) => {
    state.commands.push(command);
    state.commandsMap[command.name] = () => {
      const { run, cancel } = command.execute();
      run();
      if (!command.wantedInQueue) return;
      if (state.queue.length > 0) {
        // 可能在放置的过程中有撤销操作, 所以根据当前最新的 current 值来计算最新的 queue
        state.queue = state.queue.slice(0, state.current + 1);
      }
      state.queue.push({ run, cancel });
      state.current++;
    };
  };

  register({
    name: "redo",
    keyboard: "ctrl+y", // 键盘快捷键
    execute() {
      return {
        run() {
          console.log("redo");
        },
      };
    },
  });

  register({
    name: "ctrlZ",
    keyboard: "ctrl+z", // 键盘快捷键
    execute() {
      return {
        run() {
          console.log("ctrlZ");
        },
      };
    },
  });

  register({
    name: "drag",
    // 标识该操作需要放到队列中, 以便后续撤销和重做
    wantedInQueue: true,
    // 初始化操作
    init() {
      this.before = null;
      const start = () => {
        // 1、开始拖拽之前记住容器内当前的 blocks
        this.before = deepcopy(settings.value.blocks);
      };

      const end = () => {
        // 1、拖拽之后触发对应拖拽指令的 execute 函数中的 run 函数
        state.commandsMap.drag();
      };

      events.on("start", start);
      events.on("end", end);

      // 返回卸载函数
      return () => {
        events.off("start", start);
        events.off("end", end);
      };
    },
    execute() {
      const before = this.before;
      const after = settings.value.blocks;
      // 对于拖拽而言执行的时候可以有前进和后退
      return {
        // 将全局 settings 状态中的 blocks 置为最新的
        run() {
          settings.value = { ...settings.value, blocks: after };
        },
        // 返回上一步
        cancel() {
          settings.value = { ...settings.value, blocks: before };
        },
      };
    },
  });

  (() => {
    state.commands.forEach(
      (command) => command.init && state.destories.push(command.init())
    );
  })();

  // 清理绑定事件
  onUnmounted(() => {
    state.destories.forEach((fn) => fn && fn());
  });

  return {
    state,
  };
}
