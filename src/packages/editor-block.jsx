import { computed, defineComponent, inject, onMounted, ref } from "vue";

export default defineComponent({
  name: "editor-block",
  props: {
    block: {
      type: Object,
      default: () => ({}),
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const blockStyles = computed(() => ({
      top: props.block.top + "px",
      left: props.block.left + "px",
      zIndex: props.block.zIndex,
    }));
    const config = inject("editorConfig");
    const blockRef = ref(null);
    onMounted(() => {
      const { offsetWidth, offsetHeight } = blockRef.value;
      if (props.block.alignCenter) {
        // 第一次拖拽松手的时候才渲染的，其他默认渲染到页面上的内容不需要居中
        // 原则上需要通过派发事件来改 props 值
        props.block.left = props.block.left - offsetWidth / 2;
        props.block.top = props.block.top - offsetHeight / 2;
        props.block.alignCenter = false;
      }
      props.block.width = offsetWidth;
      props.block.height = offsetHeight;
    });
    return () => {
      const component = config.componentMap[props.block.key];
      const RenderComp = component.render({
        props: props.block.props,
        model: Object.keys(component.model || {}).reduce((memo, modelName) => {
          const propName = props.block.model[modelName];
          memo[modelName] = {
            modelValue: props.formData[propName],
            "onUpdate:modelValue": (value) =>
              (props.formData[propName] = value),
          };
          return memo;
        }, {}),
      });
      return (
        <div class="editor-block-wrap" style={blockStyles.value} ref={blockRef}>
          <RenderComp />
        </div>
      );
    };
  },
});
