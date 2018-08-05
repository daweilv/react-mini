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
