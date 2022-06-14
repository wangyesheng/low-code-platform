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

registerConfig.register({
  label: "文本",
  preview: () => <span>预览文本</span>,
  render: () => <span>渲染文本</span>,
  key: "text",
});

registerConfig.register({
  label: "按钮",
  preview: () => <ElButton>预览按钮</ElButton>,
  render: () => <ElButton>渲染按钮</ElButton>,
  key: "button",
});

registerConfig.register({
  label: "输入框",
  preview: () => <ElInput placeholder="预览输入框" />,
  render: () => <ElInput placeholder="渲染输入框" />,
  key: "input",
});
