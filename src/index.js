import React from "./react";
import { render } from "./react-dom";

render(<div>Hello World!!</div>, document.getElementById("app"));

// 可在 https://babeljs.io/repl 查看上述 jsx 的等效代码
// 两个目标，实现 React.createElement & ReactDOM.render
// import React from "./react";
// import { render } from "./react-dom";

// render(React.createElement(
//   "div",
//   null,
//   "Hello World!!"
// ), document.getElementById("app"));
