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

// 对应 babel 转换代码
/* import React, { Component } from "./react";
import { render } from "./react-dom";

class World extends Component {
  render() {
    return React.createElement(
      "div",
      { className: "World" },
      React.createElement(
        "h1",
        null,
        "Wonderful World!"
      ),
      React.createElement(Hello, null)
    );
  }
}

const Hello = () => {
  return React.createElement(
    "div",
    { classNam: "Hello" },
    "Hello World!!"
  );
};

render(React.createElement(World, null), document.getElementById("app")); */
