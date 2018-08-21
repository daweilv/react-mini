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
  function render(rootVnode, domContainer) {
    stage = Stage.Mouting;
    cdmQueque = new Queue();
    if (!rootVnode) return;
    empty(domContainer);
    // 将 DOM Element 添加到 container
    domContainer.append(parseVnode(rootVnode));
    // 按顺序 invoke cdm 事件
    invokeComponentDidMountQueue();
  }

  // 更新入口
  function rerender(inst) {
    stage = Stage.Updating;
    cdupQueque = new Queue();
    let oldNode = inst._ele;
    // todo: lifecycle 需要更新，parseVnode 考虑与 diffVnode 分离
    let ele = parseVnode(inst.render(), oldNode);
    inst._ele = ele;
    ele._inst = inst;
    addComponentDidUpdateQueue(inst);
    // oldNode.parentNode.replaceChild(ele, oldNode);
    // 按顺序 invoke cdup 事件
    invokeComponentDidUpdateQueue();
  }

  // 将类 DOM 对象渲染成 DOM Element
  // 依次处理 number / string / function & class 组件 / 普通 HTML 标签
  function parseVnode(vnode, oldNode) {
    if (typeof vnode === "number") vnode = String(vnode);
    if (typeof vnode === "string") {
      let node = parseTextVnode(vnode, oldNode);
      return node;
    }

    if (typeof vnode.type === "function") {
      let node = parseFuncVnode(vnode, oldNode);
      return node;
    }

    let node = parseEleVnode(vnode, oldNode);
    return node;
  }

  function parseTextVnode(vnode, oldNode) {
    const TEXT_NODE = 3;
    if (oldNode) {
      if (oldNode.nodeType === TEXT_NODE) {
        if (oldNode.textContent !== vnode) {
          oldNode.textContent = vnode;
        }
        return oldNode;
      } else {
        const node = document.createTextNode(vnode);
        replaceNode(node, oldNode);
        return node;
      }
    }
    const node = document.createTextNode(vnode);
    return node;
  }

  function parseFuncVnode(vnode, oldNode) {
    const comp = vnode.type;
    const props = vnode.props;
    let ele;
    let inst;
    // 继承了 React.Component 的组件拥有 render 方法
    if (comp.prototype && comp.prototype.render) {
      if (stage === Stage.Mouting) {
        inst = new comp(props);
        // cwm 事件在实例创建之后，render 之前 invoke
        invokeComponentWillMount(inst);
      } else if (stage === Stage.Updating) {
        // cwr 事件在 scu 之前 invoke
        inst = oldNode._inst;
        invokeComponentWillReceiveProps(inst);
        inst.props = vnode.props;
        if (
          !inst.shouldComponentUpdate ||
          (inst.shouldComponentUpdate &&
            inst.shouldComponentUpdate(vnode.props, inst.state))
        ) {
          invokeComponentWillUpdate(inst);
        }
      }

      ele = parseVnode(inst.render(), inst._ele);
      inst._ele = ele;
      ele._inst = inst;
    } else {
      ele = parseVnode(comp(props));
    }

    if (props.children) {
      parseVnodeChildren(props.children, ele);
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

  function parseEleVnode(vnode, oldNode) {
    let ele;
    const props = vnode.props;
    if (oldNode && isSameNode(vnode, oldNode)) {
      ele = oldNode;
    } else {
      // 普通 HTML 标签
      // todo: svg 需要 NS 支持
      ele = document.createElement(vnode.type);
    }

    // 添加/更新 attributes
    updateAttributes(ele, props);

    if (props.children) {
      parseVnodeChildren(props.children, ele);
    }
    return ele;
  }

  function parseVnodeChildren(vnodeChildren, oldParentNode) {
    if (!vnodeChildren) return;
    if (Array.isArray(vnodeChildren)) {
      diffChildren(vnodeChildren, oldParentNode);
    } else {
      diffChildren([vnodeChildren], oldParentNode);
    }
  }

  function diffChildren(vnodes, parentEle) {
    if (!parentEle) {
      vnodes.forEach(childVnode => parentEle.append(parseVnode(childVnode)));
      return;
    }
    let eles = Array.prototype.map.call(parentEle.childNodes, i => i);
    for (let vnodeIndex = 0; vnodeIndex < vnodes.length; vnodeIndex++) {
      let vnode = vnodes[vnodeIndex];
      let ele;
      for (let eleIndex = 0; eleIndex < eles.length; eleIndex++) {
        let e = eles[eleIndex];
        if (e && isSameNode(vnode, e)) {
          ele = e;
          eles[eleIndex] = undefined;
          break;
        }
      }
      let newEle = parseVnode(vnode, ele);
      let oldEle = parentEle.childNodes[vnodeIndex];
      if (newEle != oldEle) {
        if (!oldEle) {
          console.log("append", newEle);

          parentEle.appendChild(newEle);
        } else {
          console.log("insert", newEle);

          parentEle.insertBefore(newEle, oldEle);
        }
      }
    }

    for (let eleIdx = 0; eleIdx < eles.length; eleIdx++) {
      if (eles[eleIdx] !== undefined) {
        // todo: cwun
        console.log("remove ", eles[eleIdx]);
        parentEle.removeChild(eles[eleIdx]);
      }
    }
  }

  function updateAttributes(ele, attrs) {
    //todo diff attr
    for (const name in attrs) {
      if (name === "children") return;
      updateAttribute(ele, name, attrs[name]);
    }
  }

  // 采用的策略为只对已知 props 进行更新，不对未知 attrs&props 进行清空
  function updateAttribute(ele, name, value) {
    if (name.indexOf("on") === 0) {
      name = name.toLowerCase();
      if (ele[name] !== value) {
        ele[name] = value;
      }
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

  function isSameNode(vnode, ele) {
    if (typeof vnode === "string" || typeof vnode === "number") {
      return ele && ele.nodeType === 3;
    }

    if (typeof vnode.type === "function") {
      return ele && ele._inst && ele._inst.constructor === vnode.type;
    }

    return ele && vnode.type === ele.tagName.toLowerCase();
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

  function replaceNode(node, oldNode) {
    oldNode.parentNode && oldNode.parentNode.replaceChild(node, oldNode);
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
