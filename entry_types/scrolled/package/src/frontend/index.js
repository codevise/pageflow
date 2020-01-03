import React from 'react';
import ReactDOM from 'react-dom';

import AppHeader from './navigation/AppHeader';
import Entry from './Entry';

import './global.module.css';

export default function Root() {
  return (
    <>
      <AppHeader />
      <Entry />
    </>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
