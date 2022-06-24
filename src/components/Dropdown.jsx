import {
  defineComponent,
  createVNode,
  render,
  reactive,
  ref,
  computed,
  onMounted,
  onUnmounted,
  provide,
  inject,
} from "vue";

export const DropdownItem = defineComponent({
  props: {
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  setup(props) {
    const hide = inject("hide");
    return () => {
      return (
        <div class="dropdown-item" onClick={hide}>
          <i class={props.icon}></i>
          <span>{props.label}</span>
        </div>
      );
    };
  },
});

const DropdownComponent = defineComponent({
  name: "DropdownComponent",
  props: {
    options: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const state = reactive({
      options: props.options,
      visible: false,
      top: 0,
      left: 0,
    });
    const dropdownRef = ref(null);

    const classNames = computed(() => [
      "dropdown",
      state.visible ? "dropdown_active" : "",
    ]);
    const style = computed(() => ({
      top: state.top + "px",
      left: state.left + "px",
    }));

    const setVisible = (ops) => {
      ops && (state.options = ops);
      const { top, left, height, width } =
        state.options.el.getBoundingClientRect();
      state.top = top + height / 2;
      state.left = left + width / 2;
      state.visible = !state.visible;
    };

    provide("hide", () => (state.visible = false));

    ctx.expose({
      setVisible,
    });

    const onMousedown = (e) => {
      if (!dropdownRef.value.contains(e.target)) {
        state.visible = false;
      }
    };

    onMounted(() => {
      document.body.addEventListener("mousedown", onMousedown, true);
    });

    onUnmounted(() => {
      document.body.removeEventListener("mousedown", onMousedown);
    });
    return () => {
      return (
        <div class={classNames.value} style={style.value} ref={dropdownRef}>
          {state.options.content()}
        </div>
      );
    };
  },
});

let vnode;
export function $dropdown(options) {
  if (!vnode) {
    const el = document.createElement("div");
    vnode = createVNode(DropdownComponent, { options });
    render(vnode, el);
    document.body.appendChild(el);
  }
  const { setVisible } = vnode.component.exposed;
  setVisible(options);
}
