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
