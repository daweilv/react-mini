import createVNode from "./createVNode";
import Component from "./Component";

function createElement(type, attrs, ...children) {
  return createVNode(type, attrs, children);
}

const React = {
  createElement,
  Component
};

export default React;
export { createElement, Component };
