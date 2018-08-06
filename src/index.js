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
