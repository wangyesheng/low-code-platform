import deepcopy from "deepcopy";
import { computed, defineComponent, inject, ref } from "vue";

import EditorBlock from "./editor-block";
import { useMenuDragger } from "./useMenuDragger";
import { useFocus } from "./useFocus";
import { useBlockDragger } from "./useBlockDragger";
import { useCommands } from "./useCommands";
import { useButtons } from "./useButtons";
import "./editor.scss";

export default defineComponent({
  name: "editor",
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue"],
  components: {
    EditorBlock,
  },
  setup(props, ctx) {
    const settings = computed({
      get() {
        return props.modelValue;
      },
      set(newVal) {
        ctx.emit("update:modelValue", deepcopy(newVal));
      },
    });

    const containerStyles = computed(() => ({
      width: settings.value.container.width + "px",
      height: settings.value.container.height + "px",
    }));

    const config = inject("editorConfig");

    const containerRef = ref(null);

    // 1、实现物料区拖拽功能
    const { dragstart, dragend } = useMenuDragger(settings, containerRef);

    // 2、实现获取焦点
    const {
      focusState,
      lastSelectedBlock,
      blockMousedown,
      containerMousedown,
    } = useFocus(
      settings,
      // 2.1、可能选中一个之后就直接开始拖拽操作了
      (e) => {
        blockDrag(e);
      }
    );

    const { blockDrag, markLine } = useBlockDragger(
      focusState,
      lastSelectedBlock,
      settings
    );

    const { state } = useCommands(settings, focusState);

    const { buttons } = useButtons(state, settings);

    return () => (
      <div class="editor-wrap">
        <div class="editor-left">
          {config.components.map((comp) => (
            <div
              draggable
              class="editor-left-item"
              onDragstart={(e) => dragstart(e, comp)}
              onDragend={(e) => dragend(e)}
            >
              <span>{comp.label}</span>
              <div>{comp.preview()}</div>
            </div>
          ))}
        </div>
        <div class="editor-top">
          {buttons.map((btn) => {
            return (
              <div
                class="editor-top-btn-wrap"
                onClick={btn.handler}
                key={btn.key}
              >
                <i class={btn.icon}></i>
                <span>{btn.label}</span>
              </div>
            );
          })}
        </div>
        <div class="editor-right">物料属性控制栏</div>
        <div class="editor-container">
          {/* 负责产生滚动条 */}
          <div class="editor-container-canvas">
            {/* 产生内容区 */}
            <div
              class="editor-container-canvas_content"
              style={containerStyles.value}
              ref={containerRef}
              onMousedown={containerMousedown}
            >
              {settings.value.blocks.map((block, i) => (
                <editor-block
                  key={block.key}
                  block={block}
                  class={block.focus ? "editor-block-focus" : ""}
                  onMousedown={(e) => blockMousedown(e, block, i)}
                />
              ))}

              {markLine.x !== null && (
                <div class="line-x" style={{ left: markLine.x + "px" }} />
              )}

              {markLine.y !== null && (
                <div class="line-y" style={{ top: markLine.y + "px" }} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
