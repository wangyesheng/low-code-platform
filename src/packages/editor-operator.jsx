import deepcopy from "deepcopy";
import {
  ElButton,
  ElColorPicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
} from "element-plus";
import { defineComponent, inject, reactive, watch } from "vue";

export default defineComponent({
  name: "editor-operator",
  props: {
    block: {
      // 用户最后选中的元素
      type: Object,
      default: () => undefined,
    },
    settings: {
      // 默认所有的配置
      type: Object,
      default: () => ({}),
    },
    updateContainer: {
      type: Function,
    },
    updateBlock: {
      type: Function,
    },
  },
  setup(props) {
    const config = inject("editorConfig");
    const state = reactive({
      source: {},
    });
    const reset = (n, o) => {
      if (!n) {
        state.source = deepcopy(props.settings.container);
      } else {
        state.source = deepcopy(n);
      }
    };
    const apply = () => {
      if (!props.block) {
        props.updateContainer({ ...props.settings, container: state.source });
      } else {
        props.updateBlock(state.source, props.block);
      }
    };
    watch(() => props.block, reset, { immediate: true });
    return () => {
      let content = [];
      if (!props.block) {
        content.push(
          <>
            <ElFormItem label="容器宽度">
              <ElInputNumber v-model={state.source.width} />
            </ElFormItem>
            <ElFormItem label="容器高度">
              <ElInputNumber v-model={state.source.height} />
            </ElFormItem>
          </>
        );
      } else {
        const component = config.componentMap[props.block.key];
        if (component && component.props) {
          content = Object.entries(component.props).map(
            ([propName, propConfig]) => {
              return (
                <ElFormItem label={propConfig.label}>
                  {{
                    input: () => (
                      <ElInput v-model={state.source.props[propName]} />
                    ),
                    color: () => (
                      <ElColorPicker v-model={state.source.props[propName]} />
                    ),
                    select: () => (
                      <ElSelect v-model={state.source.props[propName]}>
                        {propConfig.options.map((option) => (
                          <ElOption value={option.value} label={option.label} />
                        ))}
                      </ElSelect>
                    ),
                  }[propConfig.type]()}
                </ElFormItem>
              );
            }
          );
        }

        if (component && component.model) {
          content = Object.entries(component.model).map(
            ([modelName, label]) => {
              return (
                <ElFormItem label={label}>
                  <ElInput v-model={state.source.model[modelName]} />
                </ElFormItem>
              );
            }
          );
        }
      }

      return (
        <ElForm labelPosition="top" style="padding:20px">
          {content}
          <ElFormItem>
            <ElButton type="primary" onClick={() => apply()}>
              应用
            </ElButton>
            <ElButton onClick={() => reset(props.block)}>重置</ElButton>
          </ElFormItem>
        </ElForm>
      );
    };
  },
});
