import { defineComponent } from "vue";

export default defineComponent({
  props: {
    block: {
      type: Object,
    },
    component: {
      type: Object,
    },
  },
  setup(props) {
    const { width, height } = props.component.resize || {};
    let raw = {};
    const onmousemove = (e) => {
      let { clientX, clientY } = e;
      let {
        startClientX,
        startClientY,
        startWidth,
        startHeight,
        startLeft,
        startTop,
        direction,
      } = raw;
      // 当拖动水平方向（向下向上拖）的中间点时，需要保证 clientX 值为拖动前该点距屏幕的 x 值
      if (direction.h == "center") {
        clientX = startClientX;
      }

      // 当拖动垂直方向（向左向右拖）的中间点时，需要保证 clientY 值为拖动前该点距屏幕的 y 值
      if (direction.v == "center") {
        clientY = startClientY;
      }
      let durX = clientX - startClientX;
      let durY = clientY - startClientY;

      // 针对反向拖拽的点，需要取反，拿到正确组件的 top 和 left 值
      if (direction.h == "start") {
        durX = -durX;
        props.block.left = startLeft - durX;
      }

      if (direction.v == "start") {
        durY = -durY;
        props.block.top = startTop - durY;
      }

      let w = startWidth + durX;
      let h = startHeight + durY;
      props.block.width = w;
      props.block.height = h;
      props.block.canResize = true;
    };
    const onmouseup = (e) => {
      document.body.removeEventListener("mousemove", onmousemove);
      document.body.removeEventListener("mouseup", onmouseup);
    };
    const onMouseDown = (e, direction) => {
      e.stopPropagation();
      raw = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startWidth: props.block.width,
        startHeight: props.block.height,
        startLeft: props.block.left,
        startTop: props.block.top,
        direction,
      };
      document.body.addEventListener("mousemove", onmousemove);
      document.body.addEventListener("mouseup", onmouseup);
    };

    return () => {
      return (
        <>
          {width && (
            <>
              <div
                class="block-resize block-resize-left"
                // h: 水平; v: 垂直
                onMousedown={(e) => onMouseDown(e, { h: "start", v: "center" })}
              />
              <div
                class="block-resize block-resize-right"
                onMousedown={(e) => onMouseDown(e, { h: "end", v: "center" })}
              />
            </>
          )}

          {height && (
            <>
              <div
                class="block-resize block-resize-top"
                onMousedown={(e) => onMouseDown(e, { h: "center", v: "start" })}
              />
              <div
                class="block-resize block-resize-bottom"
                onMousedown={(e) => onMouseDown(e, { h: "center", v: "end" })}
              />
            </>
          )}

          {width && height && (
            <>
              <div
                class="block-resize block-resize-top-left"
                onMousedown={(e) => onMouseDown(e, { h: "start", v: "start" })}
              />
              <div
                class="block-resize block-resize-top-right"
                onMousedown={(e) => onMouseDown(e, { h: "end", v: "start" })}
              />
              <div
                class="block-resize block-resize-bottom-left"
                onMousedown={(e) => onMouseDown(e, { h: "start", v: "end" })}
              />
              <div
                class="block-resize block-resize-bottom-right"
                onMousedown={(e) => onMouseDown(e, { h: "end", v: "end" })}
              />
            </>
          )}
        </>
      );
    };
  },
});
