import { reactive } from "vue";

export function useBlockDragger(focusState, lastSelectedBlock, settings) {
  let dragState = {
    startClientX: 0,
    startClientY: 0,
    isDragging: false, // 是否正在拖拽
  };

  let markLine = reactive({
    x: null,
    y: null,
  });

  const mousemove = (e) => {
    let { clientX: moveX, clientY: moveY } = e;

    if (!dragState.isDragging) {
      dragState.isDragging = true;
    }

    // 计算当前拖拽元素最新的 left 和 top 值，去 lineMap 找，找到就显示线
    // 鼠标移动后 - 鼠标移动前 + left;
    const newLeft = moveX - dragState.startClientX + dragState.startLeft;
    const newTop = moveY - dragState.startClientY + dragState.startTop;

    // 计算横线 距离参照物元素还有5像素的的时候就显示线
    let lineY, lineX;
    for (let i = 0; i < dragState.lines.y.length; i++) {
      const { showLineTop, BTop } = dragState.lines.y[i];
      // 判断当前拖拽元素和目标线中的拖拽元素（参照物元素 BTop）距离顶部的距离是否小于5像素
      // 当前拖拽元素 = 目标线中的拖拽元素（参照物元素）
      if (Math.abs(BTop - newTop) < 5) {
        lineY = showLineTop;
        // 实现快速和未选中的参照元素贴贴
        // moveY = 拖拽元素最开始距离浏览器的高度 - 拖拽元素最开始距离容器的高度 + 拖拽元素现在距离容器的高度
        moveY = dragState.startClientY - dragState.startTop + BTop;
        break;
      }
    }

    for (let i = 0; i < dragState.lines.x.length; i++) {
      const { showLineLeft, BLeft } = dragState.lines.x[i];
      if (Math.abs(BLeft - newLeft) < 5) {
        lineX = showLineLeft;
        moveX = dragState.startClientX - dragState.startLeft + BLeft;
        break;
      }
    }

    markLine.x = lineX;
    markLine.y = lineY;

    let durX = moveX - dragState.startClientX;
    let durY = moveY - dragState.startClientY;

    focusState.value.focus.forEach((block, i) => {
      block.top = dragState.startPosition[i].top + durY;
      block.left = dragState.startPosition[i].left + durX;
    });
  };

  const mouseup = (e) => {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    markLine.x = null;
    markLine.y = null;
  };

  const blockDrag = (e) => {
    const {
      width: BWidth,
      height: BHeight,
      left: BStartLeft,
      top: BStartTop,
    } = lastSelectedBlock.value;
    dragState = {
      startClientX: e.clientX, // 相较于浏览器的距离
      startClientY: e.clientY,
      isDragging: false,
      startPosition: focusState.value.focus.map(({ top, left }) => ({
        top,
        left,
      })),
      startLeft: BStartLeft, // B点拖拽前距离容器左侧位置
      startTop: BStartTop, // B点拖拽前距离容器顶部位置
      lines: (() => {
        // 获取其他未选中的 block 以他们的位置做辅助线
        const { unfocus } = focusState.value;
        const lineMap = {
          x: [],
          y: [],
        };
        [
          ...unfocus,
          {
            top: 0,
            left: 0,
            width: settings.value.container.width,
            height: settings.value.container.height,
          }, // 整个容器
        ].forEach((block) => {
          const {
            top: ATop,
            left: ALeft,
            width: AWidth,
            height: AHeight,
          } = block;
          // showLineTop: 辅助线距离顶部的显示位置；BTop: B元素拖拽之后距离顶部的位置；
          lineMap.y.push({ showLineTop: ATop, BTop: ATop }); // 顶对顶
          lineMap.y.push({ showLineTop: ATop, BTop: ATop - BHeight }); // 顶对底
          lineMap.y.push({
            showLineTop: ATop + AHeight / 2,
            BTop: ATop + AHeight / 2 - BHeight / 2,
          }); // 中对中
          lineMap.y.push({ showLineTop: ATop + AHeight, BTop: ATop + AHeight }); // 底对顶
          lineMap.y.push({
            showLineTop: ATop + AHeight,
            BTop: ATop + AHeight - BHeight,
          }); // 底对底

          // showLineLeft: 辅助线距离左边的显示位置；BLeft: B元素拖拽之后距离左边的位置；
          lineMap.x.push({ showLineLeft: ALeft, BLeft: ALeft }); // 左对左
          lineMap.x.push({
            showLineLeft: ALeft + AWidth,
            BLeft: ALeft + AWidth,
          }); // 左对右
          lineMap.x.push({
            showLineLeft: ALeft + AWidth / 2,
            BLeft: ALeft + AWidth / 2 - BWidth / 2,
          }); // 中对中
          lineMap.x.push({
            showLineLeft: ALeft + AWidth,
            BLeft: ALeft + AWidth - BWidth,
          }); // 右对右
          lineMap.x.push({ showLineLeft: ALeft, BLeft: ALeft - BWidth }); // 左对右
        });

        return lineMap;
      })(),
    };
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };

  return { blockDrag, markLine };
}
