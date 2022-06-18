import { ElDialog, ElInput, ElButton } from "element-plus";
import { createVNode, defineComponent, reactive, render } from "vue";

const DialogComponent = defineComponent({
  name: "DialogComponent",
  props: {
    options: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const state = reactive({
      options: props.options,
      visible: false,
    });
    const setVisible = (ops) => {
      ops && (state.options = ops);
      state.visible = !state.visible;
    };
    ctx.expose({
      setVisible,
    });
    const onConfirm = () => {
      state.options.onConfirm && state.options.onConfirm(state.options.content);
      setVisible();
    };
    return () => {
      return (
        <ElDialog v-model={state.visible} title={state.options.title}>
          {{
            default: () => {
              return (
                <ElInput
                  type="textarea"
                  rows={10}
                  v-model={state.options.content}
                />
              );
            },
            footer: () => {
              return (
                state.options.footer && (
                  <div>
                    <ElButton onClick={setVisible}>取消</ElButton>
                    <ElButton type="primary" onClick={onConfirm}>
                      确认
                    </ElButton>
                  </div>
                )
              );
            },
          }}
        </ElDialog>
      );
    };
  },
});

let vnode;
export function $dialog(options) {
  if (!vnode) {
    const el = document.createElement("div");
    vnode = createVNode(DialogComponent, { options });
    render(vnode, el);
    document.body.appendChild(el);
  }
  const { setVisible } = vnode.component.exposed;
  setVisible(options);
}
