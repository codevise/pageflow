import React from 'react';

import {SelectionRect} from '../SelectionRect';
import TextIcon from '../images/text.svg';
import HeadingIcon from '../images/heading.svg';
import ListUlIcon from '../images/listUl.svg';
import ListOlIcon from '../images/listOl.svg';
import QuoteIcon from '../images/quote.svg';

export default {
  title: 'Inline Editing/SelectionRect',
}

const insertButtonTitles = {
  before: 'Insert before',
  after: 'Insert after'
};

export const lightBackground = () =>
  <Background>
    <SelectionRect selected={true}
                   insertButtonTitles={insertButtonTitles}
                   toolbarButtons={toolbarButtons()}>
      <Placeholder />
    </SelectionRect>
  </Background>;

export const darkBackground = () =>
  <Background dark>
    <SelectionRect selected={true}
                   insertButtonTitles={insertButtonTitles}
                   toolbarButtons={toolbarButtons()}>
      <Placeholder />
    </SelectionRect>
  </Background>;

function toolbarButtons() {
  return [
    {
      name: 'text',
      text: 'Text',
      icon: TextIcon,
      active: true
    },
    {
      name: 'heading',
      text: 'Heading',
      icon: HeadingIcon,
    },
    {
      name: 'listOl',
      text: 'Bullet Points',
      icon: ListUlIcon,
    },
    {
      name: 'listUl',
      text: 'Enumeration',
      icon: ListOlIcon,
    },
    {
      name: 'quote',
      text: 'Quote',
      icon: QuoteIcon,
    }
  ];
}

function Background({dark, children}) {
  return (
    <div style={{
      width: 500,
      padding: '50px 20px',
      color: dark ? '#fff' : '#000',
      background: dark ? '#000' : '#fff'}}>
      {children}
    </div>
  );
}

function Placeholder() {
  return (
    <div style={{height: 200, background: '#4caf50'}} />
  );
}
