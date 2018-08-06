import Queue from "./Queue";
const Stage = {
  Mouting: "Mouting",
  Updating: "Updating"
};

const ReactDOM = (function() {
  let cdmQueque = null;
  let cdupQueque = null;
  let stage = null;
  // 挂载入口
  function render(rootVNode, domContainer) {
    stage = Stage.Mouting;
    cdmQueque = new Queue();
    if (!rootVNode) return;
    empty(domContainer);
    // 将 DOM Element 添加到 container
    domContainer.append(complieVNode2DOM(rootVNode));
    // 按顺序 invoke cdm 事件
    invokeComponentDidMountQueue();
  }

  // 更新入口
  function rerender(inst) {
    stage = Stage.Updating;
    cdupQueque = new Queue();
    let prevEle = inst._ele;
    let ele = complieVNode2DOM(inst.render());
    inst._ele = ele;
    ele._inst = inst;
    addComponentDidUpdateQueue(inst);
    prevEle.parentElement.replaceChild(ele, prevEle);
    // 按顺序 invoke cdup 事件
    invokeComponentDidUpdateQueue();
  }

  // 将类 DOM 对象渲染成 DOM Element
  // 依次处理 number  / string / function & class 组件 / 普通 HTML 标签
  function complieVNode2DOM(vnode) {
    if (!vnode) return null;
    if (typeof vnode === "string" || typeof vnode === "number") {
      const ele = document.createTextNode(vnode);
      return ele;
    }

    if (typeof vnode.type === "function") {
      const comp = vnode.type;
      const props = vnode.props;
      let ele;
      let inst;
      // 继承了 React.Component 的组件拥有 render 方法
      if (comp.prototype && comp.prototype.render) {
        inst = new comp(props);
        if (stage === Stage.Mouting) {
          // cwm 事件在实例创建之后，render 之前 invoke
          invokeComponentWillMount(inst);
        } else if (stage === Stage.Updating) {
          // cwr 事件在 scu 之前 invoke
          invokeComponentWillReceiveProps(inst);
          if (
            !inst.shouldComponentUpdate ||
            (inst.shouldComponentUpdate &&
              inst.shouldComponentUpdate(vnode.props, inst.state))
          ) {
            invokeComponentWillUpdate(inst);
          }
        }

        ele = complieVNode2DOM(inst.render());
        inst._ele = ele;
        ele._inst = inst;
      } else {
        ele = complieVNode2DOM(comp(props));
      }

      if (props.children) {
        if (Array.isArray(props.children)) {
          props.children.forEach(childVnode =>
            ele.append(complieVNode2DOM(childVnode))
          );
        } else {
          ele.append(complieVNode2DOM(props.children));
        }
      }
      if (stage === Stage.Mouting) {
        // 添加到 cdm 事件队列中，等待 invoke
        addComponentDidMountQueue(inst);
      } else if (stage === Stage.Updating) {
        // 添加到 cdup 事件队列中，等待 invoke
        addComponentDidUpdateQueue(inst);
      }

      return ele;
    }

    // 普通 HTML 标签
    // todo: svg 需要 NS 支持
    const ele = document.createElement(vnode.type);
    const props = vnode.props;
    // 添加/更新 attributes
    updateAttributes(ele, props);

    if (props.children) {
      if (Array.isArray(props.children)) {
        props.children.forEach(childVnode =>
          ele.append(complieVNode2DOM(childVnode))
        );
      } else {
        ele.append(complieVNode2DOM(props.children));
      }
    }
    return ele;
  }

  function updateAttributes(ele, attrs) {
    for (const name in attrs) {
      if (name === "children") return;
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

  function empty(ele) {
    while (ele.firstChild) {
      ele.removeChild(ele.firstChild);
    }
  }

  function invokeComponentWillMount(inst) {
    inst.componentWillMount && inst.componentWillMount();
  }

  function invokeComponentWillReceiveProps(inst) {
    inst.componentWillReceiveProps && inst.componentWillReceiveProps();
  }

  function invokeComponentWillUpdate(inst) {
    inst.componentWillUpdate && inst.componentWillUpdate();
  }

  function addComponentDidMountQueue(inst) {
    inst && inst.componentDidMount && cdmQueque.enqueque(inst);
  }

  function addComponentDidUpdateQueue(inst) {
    inst && inst.componentDidUpdate && cdupQueque.enqueque(inst);
  }

  function invokeComponentDidMountQueue() {
    while (cdmQueque.length()) {
      let inst = cdmQueque.dequeue();
      inst.componentDidMount && inst.componentDidMount();
    }
  }

  function invokeComponentDidUpdateQueue() {
    while (cdupQueque.length()) {
      let inst = cdupQueque.dequeue();
      inst.componentDidUpdate && inst.componentDidUpdate();
    }
  }

  return {
    render,
    rerender
  };
})();

export default ReactDOM;
const render = ReactDOM.render;
const rerender = ReactDOM.rerender;
export { render, rerender };
