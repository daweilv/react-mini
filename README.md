# React-mini

切换对应的 step 分支，一步一步看看如何实现一个 React。每个分支对应了当时笔者的思路，完全重写也是可能的。

```bash
# 安装
npm i

# 启动服务
npm run-script start

# 打包 dev 版
npm run-script dev

# 打包 prod 版
npm run-script prod
```

### 1. 渲染最简单的 DOM 元素组件 [Step1](https://github.com/daweilv/Hello-React/tree/step1)

```jsx
import React from "./react";
import { render } from "./react-dom";

render(<div>Hello World!!</div>, document.getElementById("app"));
```

实现 React.createElement & ReactDOM.render

### 2. 渲染 stateless component [Step2](https://github.com/daweilv/Hello-React/tree/step2)

```jsx
import React from "./react";
import { render } from "./react-dom";

const Hello = () => {
  return <div>Hello World!!</div>;
};

render(<Hello />, document.getElementById("app"));
```

### 3. 渲染 class component [Step3](https://github.com/daweilv/Hello-React/tree/step3)

> 在看分析 React 元素的时候发现一个 `$$typeof` 的节点，值为 `Symbol(react.element)`，好奇这是干啥的呢？一顿寻找，发现原因是为了防止 xss，用于验证节点是否是 React 自己生成的。
> [How Much XSS Vulnerability Protection is React Responsible For? #3473](https://github.com/facebook/react/issues/3473)

> 参考
> [比较与理解 React 的 Components，Elements 和 Instances](https://github.com/creeperyang/blog/issues/30)

React Node 的结构为：

```js
{
    $$typeof:Symbol(react.element),
    key,
    props:{
        children:[],
    },
    ref,
    type
}
```

修改原 createElement 直接创建三种不同 new component 的方式，改为更简洁的对象实现。

实现了 class component 、 function component 、 native dom component 混合使用。

```jsx
import React, { Component } from "./react";
import { render } from "./react-dom";

class World extends Component {
  render() {
    return (
      <div className="World">
        <h1>Wonderful World!</h1>
        <Hello />
      </div>
    );
  }
}

const Hello = () => {
  return <div classNam="Hello">Hello World!!</div>;
};

render(<World />, document.getElementById("app"));
```

### 4. 支持 props [Step4](https://github.com/daweilv/Hello-React/tree/step4)

```js
import React, { Component } from "./react";
import { render } from "./react-dom";

class HelloWorld extends Component {
  render() {
    return (
      <div className="HelloWorld">
        <Hello
          style={{ background: "grey" }}
          onClick={() => {
            alert("clicked!");
          }}
        />
        <h3 className="World" style={{ color: "red" }}>
          The Wonderful World!
        </h3>
      </div>
    );
  }
}

const Hello = ({ style, onClick }) => {
  return (
    <h1 className="Hello" style={style} onClick={onClick}>
      Hello!! Click me!
    </h1>
  );
};

render(<HelloWorld />, document.getElementById("app"));
```

### 5. 支持同步的 setState [Step5](https://github.com/daweilv/Hello-React/tree/step5)

```js
import React, { Component } from "./react";
import { render } from "./react-dom";

class HelloWorld extends Component {
  render() {
    return (
      <div className="HelloWorld">
        <Hello style={{ background: "grey" }} />
        <h3 className="World" style={{ color: "red" }}>
          The Wonderful World!
        </h3>
      </div>
    );
  }
}

class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    const { style } = this.props;
    return (
      <h1
        className="Hello"
        style={style}
        onClick={() => {
          this.setState({ count: ++this.state.count });
        }}
      >
        Hello!! Click me {this.state.count} times
      </h1>
    );
  }
}

render(<HelloWorld />, document.getElementById("app"));
```

### 6. 实现大部分生命周期(react v16.2-) [Step6](https://github.com/daweilv/Hello-React/tree/step6)

- [x] componentWillMount
- [x] componentDidMount
- [x] componentWillReciveProps
- [x] shouldComponentUpdate
- [x] componentWillUpdate
- [x] componentDidUpdate
- [ ] coponentWillUnmount

1.  挂载阶段
    组件的挂载是在 dom append 到 root container 上的一刻完成挂载，组件的 cdm 需要从子组件开始，需要一个队列来先进先出 invoke。
    写到这里，我们开始迫切地需要一个“全局”的对象，来保存我们一些上下文变量，但我们不希望污染真正的对象。于是我们创建了一个立即执行函数（闭包）。

```
parent:constructor invoked
parent:componentWillMount invoked
parent:render invoked
child1:constructor invoked
child1:componentWillMount invoked
child1:render invoked
child2:constructor invoked
child2:componentWillMount invoked
child2:render invoked
child1:componentDidMount invoked
child2:componentDidMount invoked
parent:componentDidMount invoked
```

2.  更新阶段（红色部分我们将在后面优化掉）

```diff
  parent:shouldComponentUpdate invoked
  parent:componentWillUpdate invoked
  parent:render invoked
- child1:constructor invoked
  child1:componentWillReceiveProps invoked
  child1:shouldComponentUpdate invoked
  child1:componentWillUpdate invoked
  child1:render invoked
- child2:constructor invoked
  child2:componentWillReceiveProps invoked
  child2:shouldComponentUpdate invoked
  child2:componentWillUpdate invoked
  child2:render invoked
  child1:componentDidUpdate invoked
  child2:componentDidUpdate invoked
  parent:componentDidUpdate invoked
```

```js
import React, { Component } from "./react";
import { render } from "./react-dom";

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: true
    };
  }

  render() {
    const { flag } = this.state;
    if (!flag) return null;
    return (
      <div
        style={{ backgroundColor: "grey", padding: "30px" }}
        onClick={() => {
          this.setState({
            flag: false
          });
        }}
      >
        <Parent />
      </div>
    );
  }
}

class Parent extends Component {
  constructor(props) {
    super(props);
    console.log("parent:constructor invoked");
    this.state = {
      child1Style: { color: "green" },
      child2Style: { color: "red" }
    };
  }

  componentWillMount() {
    console.log("parent:componentWillMount invoked");
  }

  componentDidMount() {
    console.log("parent:componentDidMount invoked");
  }

  componentWillReceiveProps(nextProps) {
    console.log("parent:componentWillReceiveProps invoked");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("parent:shouldComponentUpdate invoked");
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("parent:componentWillUpdate invoked");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("parent:componentDidUpdate invoked");
  }

  componentWillUnmount() {
    console.log("parent:componentWillUnmount invoked");
  }

  render() {
    console.log("parent:render invoked");
    return (
      <div
        className="parent"
        style={{ backgroundColor: "#3c3c3c" }}
        onClick={e => {
          e.stopPropagation();
          this.setState({
            child1Style: { color: "yellow" },
            child2Style: { color: "blue" }
          });
        }}
      >
        <Child1 style={this.state.child1Style} />
        <Child2 style={this.state.child2Style} />
      </div>
    );
  }
}

class Child1 extends Component {
  constructor(props) {
    super(props);
    console.log("child1:constructor invoked");
  }

  componentWillMount() {
    console.log("child1:componentWillMount invoked");
  }

  componentDidMount() {
    console.log("child1:componentDidMount invoked");
  }

  componentWillReceiveProps(nextProps) {
    console.log("child1:componentWillReceiveProps invoked");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("child1:shouldComponentUpdate invoked");
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("child1:componentWillUpdate invoked");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("child1:componentDidUpdate invoked");
  }

  componentWillUnmount() {
    console.log("child1:componentWillUnmount invoked");
  }

  render() {
    console.log("child1:render invoked");
    const { style } = this.props;
    return <div style={style}>child1</div>;
  }
}

class Child2 extends Component {
  constructor(props) {
    super(props);
    console.log("child2:constructor invoked");
  }

  componentWillMount() {
    console.log("child2:componentWillMount invoked");
  }

  componentDidMount() {
    console.log("child2:componentDidMount invoked");
  }

  componentWillReceiveProps(nextProps) {
    console.log("child2:componentWillReceiveProps invoked");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("child2:shouldComponentUpdate invoked");
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("child2:componentWillUpdate invoked");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("child2:componentDidUpdate invoked");
  }

  componentWillUnmount() {
    console.log("child2:componentWillUnmount invoked");
  }

  render() {
    console.log("child2:render invoked");
    const { style } = this.props;
    return <div style={style}>child2</div>;
  }
}

render(<Root />, document.getElementById("app"));
```
