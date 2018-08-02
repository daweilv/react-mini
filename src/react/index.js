function createElement(nodeName, props, ...children) {
  return {
    nodeName,
    props,
    children
  };
}

class Component {
  constructor(props) {
    this.state = null;
    this.props = props;
  }
}

const React = {
  createElement,
  Component
};

export default React;
export { createElement, Component };
