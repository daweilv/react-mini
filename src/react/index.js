const htmlTags = ["div"];

class React {
  static createElement(tag, props, children) {
    if (htmlTags.includes(tag)) {
      return createHTMLTag(tag, children);
    }
  }
}

function createHTMLTag(tag, children) {
  let ele;
  if (tag === "div") {
    ele = document.createElement(tag);
    if (typeof children === "string") {
      let textNode = document.createTextNode(children);
      ele.append(textNode);
    }
  }
  return ele;
}

export default React;
