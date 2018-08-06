import { rerender } from "../react-dom";

export default class Component {
  constructor(props) {
    this.state = null;
    this.props = props;
  }

  setState(state) {
    this.state = state;
    rerender(this);
  }
}
