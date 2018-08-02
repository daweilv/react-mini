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

1.  [Step1](https://github.com/daweilv/Hello-React/tree/step1)
    最简单的 DOM 元素节点

```jsx
import React from "./react";
import { render } from "./react-dom";

render(<div>Hello World!!</div>, document.getElementById("app"));
```

实现 React.createElement & ReactDOM.render

2.  [Step2](https://github.com/daweilv/Hello-React/tree/step2)
    支持 stateless functional component

```jsx
import React from "./react";
import { render } from "./react-dom";

const Hello = () => {
  return <div>Hello World!!</div>;
};

render(<Hello />, document.getElementById("app"));
```

> 目前遇到的难点在于如何将所有的 html tag 都枚举出来，img 节点的处理肯定是和 div/a/video 节点的不一样，节点的合法性属性校验也是一个大工程。

3.  [Step3](https://github.com/daweilv/Hello-React/tree/step3)
    支持 class component

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
