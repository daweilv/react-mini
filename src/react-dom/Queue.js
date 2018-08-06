export default class Queue {
  constructor() {
    this.items = [];
  }

  enqueque(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  length() {
    return this.items.length;
  }
}
