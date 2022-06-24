import { $dialog } from "../components/Dialog";

export function useButtons({ commandsMap }, settings) {
  const buttons = [
    {
      label: "撤销",
      key: "ctrlZ",
      icon: "icon-undo",
      handler: () => {
        commandsMap.ctrlZ();
      },
    },
    {
      label: "复原",
      key: "redo",
      icon: "icon-redo",
      handler: () => {
        commandsMap.redo();
      },
    },
    {
      label: "置顶",
      key: "placeTop",
      icon: "icon-control-top",
      handler: () => {
        commandsMap.placeTop();
      },
    },
    {
      label: "置底",
      key: "placeBottom",
      icon: "icon-control-bottom",
      handler: () => {
        commandsMap.placeBottom();
      },
    },
    {
      label: "删除",
      key: "delete",
      icon: "icon-delete",
      handler: () => commandsMap.delete(),
    },
    {
      label: "导入",
      key: "import",
      icon: "icon-import",
      handler: () => {
        $dialog({
          title: "导入",
          content: "",
          footer: true,
          onConfirm(value) {
            commandsMap.updateContainer(JSON.parse(value));
          },
        });
      },
    },
    {
      label: "导出",
      key: "export",
      icon: "icon-export",
      handler: () => {
        $dialog({
          title: "导出",
          content: JSON.stringify(settings.value),
        });
      },
    },
    {
      label: "预览",
      key: "preview",
      icon: "icon-preview",
      handler: () => console.log("preview"),
    },
    {
      label: "保存",
      key: "save",
      icon: "icon-save",
      handler: () => console.log("save"),
    },
  ];
  return {
    buttons,
  };
}
