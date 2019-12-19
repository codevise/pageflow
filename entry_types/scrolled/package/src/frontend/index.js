import React from 'react';
import ReactDOM from 'react-dom';

import AppHeader from './navigation/AppHeader';
import Entry from './Entry';

import './global.module.css';

const examples = {
  example: pageflowScrolledSeed
}

export default function Example() {
  return (
    <>
      <AppHeader />
      <Entry examples={examples} defaultExample="example" />
    </>
  );
}

ReactDOM.render(<Example />, document.getElementById('root'));
