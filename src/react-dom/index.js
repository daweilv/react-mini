class ReactDOM {
  static render(rootEle, container) {
    container.append(rootEle);
  }
}

export default ReactDOM;

const render = ReactDOM.render;

export { render };
