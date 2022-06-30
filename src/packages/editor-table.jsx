import deepcopy from "deepcopy";
import { ElButton } from "element-plus";
import { defineComponent, computed } from "vue";

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
      //   $tableDialog({
      //     config: props.propConfig,
      //     data: state.value,
      //     onConfirm(value) {
      //       state.value = value;
      //     },
      //   });
    };
    return () => {
      return (
        <div>
          {!state.value || state.value.length == 0 ? (
            <ElButton onClick={onShowTableDialog}>添加</ElButton>
          ) : null}
        </div>
      );
    };
  },
});
