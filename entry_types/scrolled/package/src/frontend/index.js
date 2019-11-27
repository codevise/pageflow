import React from 'react';
import ReactDOM from 'react-dom';

import Entry from './Entry';

import example from './example';

import './global.module.css';

const examples = {
  example
}

export default function Example() {
  return (
    <Entry examples={examples} defaultExample="example" />
  );
}

ReactDOM.render(<Example />, document.getElementById('root'));
