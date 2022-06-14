export function useMenuDragger(settings, domRef) {
  let currentComponent = null;

  const dragenter = (e) => {
    e.dataTransfer.dropEffect = "move"; // h5提供的拖动图标
  };
  const dragover = (e) => {
    e.preventDefault();
  };
  const dragleave = (e) => {
    e.dataTransfer.dropEffect = "none";
  };
  const drop = (e) => {
    const blocks = settings.value.blocks;
    settings.value = {
      ...settings.value,
      blocks: [
        ...blocks,
        {
          top: e.offsetY, // 相对于 domRef 的偏移量
          left: e.offsetX,
          zIndex: 1,
          key: currentComponent.key,
          alignCenter: true,
        },
      ],
    };
    currentComponent = null;
  };

  const dragstart = (e, component) => {
    // dragenter 进入元素中，添加一个移动的标识
    // dragover 在目标元素中经过，必须要阻止默认行为，否则不能出发 drop
    // dragleave 离开元素的时候，需要增加一个禁用标识
    // drop 松手的时候，根据拖拽的组件添加一个组件
    domRef.value.addEventListener("dragenter", dragenter);
    domRef.value.addEventListener("dragover", dragover);
    domRef.value.addEventListener("dragleave", dragleave);
    domRef.value.addEventListener("drop", drop);
    currentComponent = component;
  };

  const dragend = (e, component) => {
    domRef.value.removeEventListener("dragenter", dragenter);
    domRef.value.removeEventListener("dragover", dragover);
    domRef.value.removeEventListener("dragleave", dragleave);
    domRef.value.removeEventListener("drop", drop);
  };

  return {
    dragstart,
    dragend,
  };
}
