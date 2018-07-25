class ReactDOM {
  static render(rootComponent, container) {
    // 将 DOM Element 添加到 container
    container.append(render2DOM(rootComponent));
  }
}

// 将类 DOM 对象渲染成 DOM Element
function render2DOM(comp) {
  let ele = document.createElement(comp.tagName);
  if (comp.text) {
    let text = document.createTextNode(comp.text);
    ele.append(text);
  }
  if (ele.children.length) {
    comp.children.forEach(childComp => {
      ele.append(render2DOM(childComp));
    });
  }
  return ele;
}

export default ReactDOM;

const render = ReactDOM.render;

export { render };
