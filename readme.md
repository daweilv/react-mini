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

1.  [step1](https://github.com/daweilv/Hello-React/tree/step1)

```jsx
import React from "./react";
import { render } from "./react-dom";

render(<div>Hello World!!</div>, document.getElementById("app"));
```

实现 React.createElement & ReactDOM.render
