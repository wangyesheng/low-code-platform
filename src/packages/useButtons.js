import html2canvas from "html2canvas";
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
      handler: () => {
        html2canvas(document.querySelector("#editorWrap"), {
          backgroundColor: "#112867",
          ignoreElements: function (param) {
            var flag = false;
            if (param.id === "editorTop" || param.id == "editorLeft") {
              flag = true;
            }
            return flag;
          },
        })
          .then((canvas) => {
            return {
              canvas,
            };
          })
          .then(({ canvas }) => {
            //下载动作
            var el = document.createElement("a");
            canvas.toBlob((blob) => {
              el.href = URL.createObjectURL(blob);
              el.download = "demo"; //设置下载文件名称
              document.body.appendChild(el);
              var evt = document.createEvent("MouseEvents");
              evt.initEvent("click", false, false);
              el.dispatchEvent(evt);
              document.body.removeChild(el);
            });
          });
      },
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
