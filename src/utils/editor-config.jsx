// 列表区可以显示所有物料
// key 对应组件的映射关系
import { ElButton, ElInput, ElOption, ElSelect } from "element-plus";
import Range from "../components/Range";

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
const createTableProp = (label, table) => ({
  type: "table",
  label,
  table,
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
  resize: {
    width: true,
    height: true,
  },
  preview: () => <ElButton>预览按钮</ElButton>,
  render: ({ props, size }) => (
    <ElButton
      style={{ height: size.height + "px", width: size.width + "px" }}
      type={props.type}
      size={props.size}
    >
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
  resize: {
    width: true,
  },
  preview: () => <ElInput placeholder="预览输入框" />,
  render: ({ model, size }) => (
    <ElInput
      placeholder="渲染输入框"
      {...model.default}
      style={{ width: size.width + "px" }}
    />
  ),
  key: "input",
  model: {
    default: "绑定字段",
  },
});

registerConfig.register({
  label: "范围选择器",
  preview: () => <Range />,
  render: ({ model }) => (
    <Range
      {...{
        start: model.start.modelValue,
        end: model.end.modelValue,
        "onUpdate:start": model.start["onUpdate:modelValue"],
        "onUpdate:end": model.end["onUpdate:modelValue"],
      }}
    />
  ),
  key: "range",
  model: {
    start: "开始字段",
    end: "结束字段",
  },
});

registerConfig.register({
  label: "下拉框",
  preview: () => <ElSelect modelValue="" />,
  render: ({ props, model }) => {
    return (
      <ElSelect {...model.default}>
        {(props.options || []).map((el, i) => (
          <ElOption label={el.label} value={el.value} key={i} />
        ))}
      </ElSelect>
    );
  },
  key: "select",
  props: {
    options: createTableProp("下拉选项", {
      options: [
        { label: "显示值", field: "label" },
        { label: "绑定值", field: "value" },
      ],
      key: "label", // 显示给用户的值是 `label`
    }),
  },
  model: {
    default: "绑定字段",
  },
});
