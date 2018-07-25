切换对应的 step 分支，一步一步看看如何实现一个 React。

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
