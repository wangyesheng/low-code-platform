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
      const onmousemove = () => {};
      const onmouseup = () => {};
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
