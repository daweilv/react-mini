import { Component } from "../react";

function render(rootVNode, domContainer) {
  // 将 DOM Element 添加到 container
  domContainer.append(complie2DOM(rootVNode));
}
// 将类 DOM 对象渲染成 DOM Element
// 依次处理 number  / string / function & class 组件 / 普通 HTML 标签
function complie2DOM(vnode) {
  if (typeof vnode === "number") vnode = String(vnode);
  if (typeof vnode === "string") {
    const textDOMNode = document.createTextNode(vnode);
    return textDOMNode;
  }

  if (typeof vnode.nodeName === "function") {
    let comp = vnode.nodeName;
    let props = vnode.props;
    let inst;
    // 继承了 React.Component 的组件拥有 render 方法
    if (comp.prototype && comp.prototype.render) {
      inst = new comp(props);
    } else {
      inst = new Component(props);
      inst.render = function() {
        return comp.call(this, props);
      };
    }

    let ele = complie2DOM(inst.render());
    inst._ele = ele;
    ele._inst = inst;

    if (vnode.children && vnode.children.length) {
      vnode.children.forEach(childVnode => ele.append(complie2DOM(childVnode)));
    }
    return ele;
  }

  // 普通 HTML 标签
  // todo: svg 需要 NS 支持
  let ele = document.createElement(vnode.nodeName);

  if (vnode.children && vnode.children.length) {
    vnode.children.forEach(childVnode => ele.append(complie2DOM(childVnode)));
  }
  return ele;
}

const ReactDOM = {
  render
};

export default ReactDOM;

export { render };
