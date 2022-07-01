import deepcopy from "deepcopy";
import {
  ElButton,
  ElDialog,
  ElInput,
  ElTable,
  ElTableColumn,
} from "element-plus";
import { createVNode, defineComponent, reactive, render } from "vue";

const TableDialogComponent = defineComponent({
  props: {
    options: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const state = reactive({
      options: props.options,
      visible: false,
      editData: [],
    });
    const setVisible = (options) => {
      if (options) {
        state.options = options;
        state.editData = deepcopy(options.data) || [];
      }
      state.visible = !state.visible;
    };
    const add = () => {
      state.editData.push({});
    };
    const onConfirm = () => {
      state.options.onConfirm(state.editData);
      state.visible = false;
    };
    ctx.expose({
      setVisible,
    });
    return () => {
      return (
        <ElDialog v-model={state.visible} title={state.options.title}>
          {{
            default: () => (
              <div>
                <div>
                  <ElButton onClick={add}>添加</ElButton>
                  <ElButton>重置</ElButton>
                </div>
                <ElTable data={state.editData}>
                  {state.options.config.table.options.map((o) => (
                    <ElTableColumn label={o.label}>
                      {{
                        default: ({ row }) => (
                          <ElInput v-model={row[o.field]} />
                        ),
                      }}
                    </ElTableColumn>
                  ))}
                </ElTable>
              </div>
            ),
            footer: () => (
              <>
                <ElButton onClick={() => setVisible(null)}>取消</ElButton>
                <ElButton type="primary" onClick={onConfirm}>
                  确定
                </ElButton>
              </>
            ),
          }}
        </ElDialog>
      );
    };
  },
});

let vnode;
export function $tableDialog(options) {
  if (!vnode) {
    const el = document.createElement("div");
    vnode = createVNode(TableDialogComponent, { options });
    render(vnode, el);
    document.body.appendChild(el);
  }

  const { setVisible } = vnode.component.exposed;
  setVisible(options);
}
