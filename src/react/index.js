import { complieVNode2DOM } from "../react-dom";

function createElement(type, attrs, ...children) {
  let vNode = { key: null, ref: null, props: {} };
  vNode.$$typeof = Symbol("react.element");
  vNode.type = type;
  for (let name in attrs) {
    if (name === "key") {
      vNode.key = attrs.key;
      delete attrs.key;
    } else {
      vNode.props = attrs;
      if (children && children.length) {
        Object.assign(vNode.props, {
          children: children.length > 1 ? children : children[0]
        });
      }
    }
  }
  return vNode;
}

class Component {
  constructor(props) {
    this.state = null;
    this.props = props;
  }

  setState(state) {
    this.state = state;
    rerender(this);
  }
}

const React = {
  createElement,
  Component
};

function rerender(inst) {
  let prevEle = inst._ele;
  let ele = complieVNode2DOM(inst.render());
  inst._ele = ele;
  ele._inst = inst;
  prevEle.parentElement.replaceChild(ele, prevEle);
}

export default React;
export { createElement, Component };
