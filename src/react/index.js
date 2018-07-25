class ReactBaseComponent {
  append(component) {
    component.parent = this;
    this.children.push(component);
  }
}

class ReactDOMComponent extends ReactBaseComponent {
  constructor(props) {
    super(props);
    this.tagName = props.tagName;
    this.text = props.text;
    this.children = [];
  }
}

class ReactFunctioncalComponent extends ReactBaseComponent {}

class ReactClassComponent extends ReactBaseComponent {}

class React {
  static createElement(tagName, props, ...children) {
    // 从现在开始 createElement 不再像 step1 一样直接创建 DOM，而是创建一个类 DOM 对象
    if (typeof tagName === "string") {
      return createDOMComponent(tagName, props, ...children);
    } else if (typeof tagName === "function") {
      let comp = tagName;
      if (comp instanceof ReactClassComponent) {
        return createClassComponent(comp, props, ...children);
      } else {
        return createFunctionalComponent(comp, props, ...children);
      }
    }
  }
}

function createDOMComponent(tagName, props, ...children) {
  let comp = new ReactDOMComponent({ tagName });
  comp.props = props;
  children.forEach(item => {
    if (typeof item === "string") {
      comp.text = item;
    } else {
      comp.append(item);
    }
  });
  return comp;
}

function createFunctionalComponent(fn, props, ...children) {
  let comp = fn();
  comp.props = props;
  children.forEach(item => {
    comp.append(item);
  });
  return comp;
}

export default React;
