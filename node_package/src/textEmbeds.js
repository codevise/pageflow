/*global ReactDOMServer*/

import React from 'react';
import ReactDOM from 'react-dom';

export class TextEmbeds {
  constructor(reactDOMServer) {
    this.textEmbedComponents = {};
    this.reactDOMServer = reactDOMServer;
  }

  register(name, {component}) {
    this.textEmbedComponents[name] = component;
  }

  renderInString(html) {
    return html.replace(/\{([a-z]+)(( [a-z]+="[^"]*")*)\}/gi, (match, embedName, params) => {
      const props = parseParams(params);
      const component = React.createElement(this.textEmbedComponents[embedName],
                                            props);

      const html = this.reactDOMServer.renderToString(component);

      return `<div data-embed="${embedName}" ` +
             `data-embed-props="${escapeHTML(JSON.stringify(props))}">${html}</div>`;
    });
  }

  mountInElement(element) {
    Array.from(element.querySelectorAll('[data-embed]')).forEach(embedWrapper => {
      const embedName = embedWrapper.getAttribute('data-embed');
      const props = JSON.parse(embedWrapper.getAttribute('data-embed-props'));

      const component = React.createElement(this.textEmbedComponents[embedName],
                                            props);

      ReactDOM.render(component, embedWrapper);
    });
  }

  unmountInElement(element) {
    Array.from(element.querySelectorAll('[data-embed]')).forEach(embedWrapper => {
      ReactDOM.unmountComponentAtNode(embedWrapper);
    });
  }
}

export default new TextEmbeds(typeof ReactDOMServer !== 'undefined' ?
                              ReactDOMServer :
                              {renderToString() { return ''; }});

function parseParams(paramsString) {
  const paramRegExp = /([a-z]+)="([^"]*)"/g;
  const result = {};

  var matches;

  while ((matches = paramRegExp.exec(paramsString))) {
    result[matches[1]] = matches[2];
  }

  return result;
}

function escapeHTML(text) {
  return text.replace(/"/g, '&quot;');
}
