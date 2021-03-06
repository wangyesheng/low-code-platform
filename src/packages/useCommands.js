import deepcopy from "deepcopy";
import { onUnmounted } from "vue";
import { events } from "./event";

/**
 * useCommands
  1、注册每一个指令对应的执行函数
  2、drag 指令包含一个 init 执行函数，init 函数中订阅两个事件 start 和 end，等待左侧物料区拖拽的时候触发
  3、start 函数记录未拖拽前容器中所存在的 blocks，end 函数在左侧物料区拖拽事件结束之后执行，此时容器中所存在的 blocks 已经是最新的
  4、end 函数执行流程：
      a. 触发 drag  指令的 execute 函数，execute 函数中存在拖拽前的 blocks 和拖拽结束后的 blocks 
      b. 返回两个新函数 go 与 back
      c. go 函数执行，将当前 settings 计算属性中的 blocks 值替换未最新（这一步感觉可以省略，因为拖拽结束之后已经同步改掉了）	 
      d. 判断当前的操作是否需要记录进历史记录中，如果需要判断历史记录队列中的个数是否大于0
  5、execute 函数执行，返回两个新函数 go 和 back
 * @param {*} settings 
 * @returns 
 */
export function useCommands(settings, focusState) {
  const state = {
    current: -1, // 前进后退的索引值
    historyQueue: [], // 所有操作指令的历史记录
    commandsMap: {}, // 操作指令和执行功能的映射表 { ctrlZ: ()=>{}, redo: ()=>{} }
    commands: [], // 所有的命令
    destories: [], // 卸载函数
  };

  const register = (command) => {
    state.commands.push(command);
    state.commandsMap[command.name] = (...args) => {
      const { go, back } = command.execute(...args);
      go();
      if (!command.wantedInQueue) return;
      if (state.historyQueue.length > 0) {
        // 可能在放置的过程中有撤销操作, 所以根据当前最新的 current 值来计算最新的 historyQueue
        state.historyQueue = state.historyQueue.slice(0, state.current + 1);
      }
      state.historyQueue.push({ go, back });
      state.current++;
    };
  };

  register({
    name: "redo",
    keyboard: "ctrl+y", // 复原
    execute() {
      return {
        go() {
          const layer = state.historyQueue[++state.current];
          layer && layer.go && layer.go();
        },
      };
    },
  });

  register({
    name: "ctrlZ",
    keyboard: "ctrl+z", // 撤销
    execute() {
      return {
        go() {
          if (state.current == -1) return;
          const layer = state.historyQueue[state.current--];
          layer && layer.back && layer.back();
        },
      };
    },
  });

  register({
    name: "updateContainer", // 更新整个容器内部的 blocks
    wantedInQueue: true,
    execute(newValue) {
      let before = settings.value;
      let after = newValue;
      return {
        go() {
          settings.value = after;
        },
        back() {
          settings.value = before;
        },
      };
    },
  });

  register({
    name: "updateBlock", // 更新整个容器内部的 blocks
    wantedInQueue: true,
    execute(newValue, oldValue) {
      let before = deepcopy(settings.value.blocks);
      let after = (() => {
        const blocks = [...settings.value.blocks];
        const index = blocks.indexOf(oldValue);
        if (index > -1) {
          blocks.splice(index, 1, newValue);
        }
        return blocks;
      })();
      return {
        go() {
          settings.value = { ...settings.value, blocks: after };
        },
        back() {
          settings.value = { ...settings.value, blocks: before };
        },
      };
    },
  });

  register({
    name: "placeTop",
    wantedInQueue: true,
    execute() {
      let before = deepcopy(settings.value.blocks);
      const after = (() => {
        const { focus, unfocus } = focusState.value;
        // Infinity => 无穷大
        const maxZIndex = unfocus.reduce((prev, current) => {
          return Math.max(prev, current.zIndex);
        }, -Infinity);
        focus.forEach((x) => (x.zIndex = maxZIndex + 1));
        return settings.value.blocks;
      })();
      return {
        go() {
          settings.value = { ...settings.value, blocks: after };
        },
        back() {
          settings.value = { ...settings.value, blocks: before };
        },
      };
    },
  });

  register({
    name: "placeBottom",
    wantedInQueue: true,
    execute() {
      let before = deepcopy(settings.value.blocks);
      const after = (() => {
        const { focus, unfocus } = focusState.value;
        // Infinity => 无穷大
        let minZIndex =
          unfocus.reduce((prev, current) => {
            return Math.min(prev, current.zIndex);
          }, Infinity) - 1;

        // 兼容最小值如果是负数的情况将会定位到容器底部
        if (minZIndex < 0) {
          const abs = Math.abs(minZIndex);
          minZIndex = 0;
          unfocus.forEach((x) => (x.zIndex += abs));
        }

        focus.forEach((x) => (x.zIndex = minZIndex));

        return settings.value.blocks;
      })();
      return {
        go() {
          settings.value = { ...settings.value, blocks: after };
        },
        back() {
          settings.value = { ...settings.value, blocks: before };
        },
      };
    },
  });

  register({
    name: "delete",
    wantedInQueue: true,
    execute() {
      const before = deepcopy(settings.value.blocks);
      const after = focusState.value.unfocus;
      return {
        go() {
          settings.value = { ...settings.value, blocks: after };
        },
        back() {
          settings.value = { ...settings.value, blocks: before };
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
        // 1、拖拽之后触发对应拖拽指令的 execute 函数中的 go 函数
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
        go() {
          settings.value = { ...settings.value, blocks: after };
        },
        // 返回上一步
        back() {
          settings.value = { ...settings.value, blocks: before };
        },
      };
    },
  });

  const keyboardEvent = (() => {
    const keyCodeMap = {
      90: "z",
      89: "y",
    };
    const onKeydown = (e) => {
      const { ctrlKey, keyCode } = e;
      if (ctrlKey && keyCodeMap[keyCode]) {
        const keyboard = "ctrl" + "+" + keyCodeMap[keyCode];
        state.commands.forEach(({ keyboard: _keyboard, name }) => {
          if (!keyboard) return;
          if (keyboard == _keyboard) {
            state.commandsMap[name]();
          }
        });
      }
    };
    const init = () => {
      // 初始化监听键盘按下事件
      window.addEventListener("keydown", onKeydown);
      return () => {
        // 销毁事件
        window.removeEventListener("keydown", onKeydown);
      };
    };
    return init;
  })();

  (() => {
    state.destories.push(keyboardEvent());
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
