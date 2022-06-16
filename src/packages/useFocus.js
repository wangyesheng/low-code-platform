import { computed, ref } from "vue";

export function useFocus(settings, cb) {
  const lastSelectedIndex = ref(-1);
  // 摁住 shift 键选择多个 block 时，最后选中的 block，用于之后绘制辅助线
  const lastSelectedBlock = computed(
    () => settings.value.blocks[lastSelectedIndex.value]
  );

  // 计算出哪些 block 获取焦点了，哪些没获取
  const focusState = computed(() => {
    const focus = [];
    const unfocus = [];
    settings.value.blocks.forEach((x) => (x.focus ? focus : unfocus).push(x));
    return {
      focus,
      unfocus,
    };
  });

  const blockMousedown = (e, block, index) => {
    e.preventDefault();
    e.stopPropagation();
    // block 上定义一个 focus 属性，获取焦点之后就将 focus 置为 true
    if (e.shiftKey) {
      if (focusState.value.focus.length <= 1) {
        // 当前只有一个节点被选中时，摁住 shift 键也不会切换 focus 状态
        block.focus = true;
      } else {
        // 按住 shift 键的时候是多选
        block.focus = !block.focus;
      }
    } else {
      if (!block.focus) {
        // 清空其他 block 的 focus
        clearBlockFocus();
        block.focus = true;
      }
    }
    lastSelectedIndex.value = index;
    cb && cb(e);
  };

  const clearBlockFocus = () => {
    settings.value.blocks.forEach((x) => (x.focus = false));
  };

  // 点击容器区域清空所有 block 的 focus
  const containerMousedown = () => {
    clearBlockFocus();
    lastSelectedIndex.value = -1;
  };

  return {
    focusState,
    lastSelectedBlock,
    blockMousedown,
    clearBlockFocus,
    containerMousedown,
  };
}
