import deepcopy from "deepcopy";
import { ElButton, ElTag } from "element-plus";
import { defineComponent, computed } from "vue";
import { $tableDialog } from "../components/TableDialog";

export default defineComponent({
  name: "EditorTable",
  props: {
    propConfig: {
      type: Object,
    },
    modelValue: {
      type: Array,
    },
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    const state = computed({
      get() {
        return props.modelValue || [];
      },
      set(newValue) {
        ctx.emit("update:modelValue", deepcopy(newValue));
      },
    });
    const onShowTableDialog = () => {
      $tableDialog({
        title: "添加数据源",
        config: props.propConfig,
        // state.value => block.props
        data: state.value,
        onConfirm(value) {
          state.value = value;
        },
      });
    };
    return () => {
      return (
        <div>
          {!state.value ||
            (state.value.length == 0 && (
              <ElButton onClick={onShowTableDialog}>添加</ElButton>
            ))}

          {(state.value || []).map((el) => (
            <ElTag onClick={onShowTableDialog}>
              {el[props.propConfig.table.key]}
            </ElTag>
          ))}
        </div>
      );
    };
  },
});
