import deepcopy from "deepcopy";
import { computed, defineComponent, inject, ref } from "vue";

import EditorBlock from "./editor-block";
import { useMenuDragger } from "./useMenuDragger";
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

    // 3、实现拖拽多个元素功能

    const onBlockMousedown = (e, block) => {
      e.preventDefault();
      e.stopPropagation();
      // block 上定义一个 focus 属性，获取焦点之后就将 focus 置为 true
      if (!block.focus) {
        // 清空其他 block 的 focus
        clearBlockFocus();
        block.focus = true;
      } else {
        block.focus = false;
      }
    };

    const clearBlockFocus = () => {
      settings.value.blocks.forEach((x) => (x.focus = false));
    };

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
        <div class="editor-top">菜单栏</div>
        <div class="editor-right">物料属性控制栏</div>
        <div class="editor-container">
          {/* 负责产生滚动条 */}
          <div class="editor-container-canvas">
            {/* 产生内容区 */}
            <div
              class="editor-container-canvas_content"
              style={containerStyles.value}
              ref={containerRef}
            >
              {settings.value.blocks.map((block) => (
                <editor-block
                  block={block}
                  class={block.focus ? "editor-block-focus" : ""}
                  onMousedown={(e) => onBlockMousedown(e, block)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
