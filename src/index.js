import React from "./react";
import { render } from "./react-dom";

const Hello = () => {
  return <div>Hello World!!</div>;
};

render(<Hello />, document.getElementById("app"));

// import React from "./react";
// import { render } from "./react-dom";

// const Hello = () => {
//   return React.createElement("div", null, "Hello World!!");
// };

// render(React.createElement(Hello, null), document.getElementById("app"));
