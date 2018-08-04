import { Component } from "../react";

function render(rootVNode, domContainer) {
  // 将 DOM Element 添加到 container
  domContainer.append(complieVNode2DOM(rootVNode));
}
// 将类 DOM 对象渲染成 DOM Element
// 依次处理 number  / string / function & class 组件 / 普通 HTML 标签
function complieVNode2DOM(vnode) {
  if (typeof vnode === "number") vnode = String(vnode);
  if (typeof vnode === "string") {
    const textDOMNode = document.createTextNode(vnode);
    return textDOMNode;
  }

  if (typeof vnode.nodeName === "function") {
    let comp = vnode.nodeName;
    let ele;
    // 继承了 React.Component 的组件拥有 render 方法
    if (comp.prototype && comp.prototype.render) {
      let inst = new comp(vnode.props);
      ele = complieVNode2DOM(inst.render());
      inst._ele = ele;
      ele._inst = inst;
    } else {
      ele = complieVNode2DOM(comp(vnode.props));
    }

    if (vnode.children && vnode.children.length) {
      vnode.children.forEach(childVnode =>
        ele.append(complieVNode2DOM(childVnode))
      );
    }
    return ele;
  }

  // 普通 HTML 标签
  // todo: svg 需要 NS 支持
  let ele = document.createElement(vnode.nodeName);

  // 添加/更新 attributes
  updateAttributes(ele, vnode.props);

  if (vnode.children && vnode.children.length) {
    vnode.children.forEach(childVnode =>
      ele.append(complieVNode2DOM(childVnode))
    );
  }
  return ele;
}

function updateAttributes(ele, attrs) {
  for (let name in attrs) {
    updateAttribute(ele, name, attrs[name]);
  }
}

// 采用的策略为只对已知 props 进行更新，不对未知 attrs&props 进行清空
function updateAttribute(ele, name, value) {
  if (name.indexOf("on") === 0) {
    name = name.toLowerCase();
    ele[name] = value;
  } else if (name === "style") {
    Object.assign(ele.style, value);
  } else {
    if (name in ele) {
      // 设置 property
      ele[name] = value || "";
    } else {
      if (value) {
        ele.setAttribute(name, value);
      } else {
        ele.removeAttribute(name, value);
      }
    }
  }
}

const ReactDOM = {
  render
};

export default ReactDOM;

export { render };
