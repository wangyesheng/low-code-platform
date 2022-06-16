import { ref } from "vue";

export function useCommands() {
  const state = {
    current: -1, // 前进后退的索引值
    queue: [], // 所有的操作指令
    commandsMap: {}, // 操作指令和执行功能的映射表 { ctrlZ: ()=>{}, redo: ()=>{} }
    commandOrders: [], // 所有的命令
  };

  const register = (command) => {
    state.commandOrders.push(command);
    state.commandsMap[command.name] = () => {
      const { run } = command.execute();
      run();
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

  return {
    state,
  };
}
