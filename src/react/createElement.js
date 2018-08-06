function createVNode(type, attrs, children) {
  let vNode = { key: null, ref: null, props: {} };
  vNode.$$typeof = Symbol("react.element");
  vNode.type = type;

  if (attrs) {
    for (let name in attrs) {
      if (name === "key") {
        vNode.key = attrs.key;
        delete attrs.key;
      } else {
        vNode.props = attrs;
      }
    }
  }

  if (children && children.length) {
    Object.assign(vNode.props, {
      children: children.length > 1 ? children : children[0]
    });
  }
  return vNode;
}

export default function createElement(type, attrs, ...children) {
  return createVNode(type, attrs, children);
}
