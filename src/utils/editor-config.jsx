// 列表区可以显示所有物料
// key 对应组件的映射关系
import { ElButton, ElInput } from "element-plus";

function createEditorConfig() {
  const components = [];
  const componentMap = {};

  return {
    register: (component) => {
      components.push(component);
      componentMap[component.key] = component;
    },
    components,
    componentMap,
  };
}

export const registerConfig = createEditorConfig();

const createInputProp = (label) => ({ type: "input", label });
const createColorProp = (label) => ({ type: "color", label });
const createSelectProp = (label, options) => ({
  type: "select",
  label,
  options,
});

registerConfig.register({
  label: "文本",
  preview: () => <span>预览文本</span>,
  render: ({ props }) => (
    <span style={{ color: props.color, fontSize: props.size }}>
      {props.text || "渲染文本"}
    </span>
  ),
  key: "text",
  props: {
    text: createInputProp("输入文本"),
    color: createColorProp("字体颜色"),
    size: createSelectProp("字体大小", [
      { label: "12px", value: "12px" },
      { label: "14px", value: "14px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
    ]),
  },
});

registerConfig.register({
  label: "按钮",
  preview: () => <ElButton>预览按钮</ElButton>,
  render: ({ props }) => (
    <ElButton type={props.type} size={props.size}>
      {props.text || "渲染按钮"}
    </ElButton>
  ),
  key: "button",
  props: {
    text: createInputProp("按钮内容"),
    type: createSelectProp("按钮类型", [
      { label: "基础", value: "primary" },
      { label: "成功", value: "success" },
      { label: "警告", value: "warning" },
      { label: "危险", value: "danger" },
    ]),
    size: createSelectProp("按钮大小", [
      { label: "大", value: "large" },
      { label: "默认", value: "default" },
      { label: "小", value: "small" },
    ]),
  },
});

registerConfig.register({
  label: "输入框",
  preview: () => <ElInput placeholder="预览输入框" />,
  render: ({ model }) => (
    <ElInput placeholder="渲染输入框" {...model.default} />
  ),
  key: "input",
  model: {
    default: "绑定字段",
  },
});
