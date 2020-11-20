import React from 'react';
import {DndProvider, useDrag} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {EditableText} from '../EditableText';
import {EditorStateProvider} from '../EditorState';
import {ContentElementEditorStateProvider} from '../ContentElementEditorStateProvider';
import {ContentElementAttributesProvider} from '../../useContentElementAttributes';
import {RootProviders} from 'pageflow-scrolled/frontend';

import {normalizeAndMergeFixture} from 'pageflow-scrolled/spec/support/stories';

export default {
  title: 'Inline Editing/EditableText',
  parameters: {
    percy: {skip: true}
  }
}

export const lightBackground = () =>
  <Background>
    <EditableText value={exampleValue}
                  contentElementId={1} />
  </Background>;

export const darkBackground = () =>
  <Background dark>
    <EditableText value={exampleValue}
                  contentElementId={1} />
  </Background>;

function Background({dark, children}) {
  return (
    <RootProviders seed={normalizeAndMergeFixture()}>
      <DndProvider backend={HTML5Backend}>
        <EditorStateProvider>
          <ContentElementAttributesProvider id={1}>
            <ContentElementEditorStateProvider id={1}>
              <div style={{
                width: 500,
                padding: '50px',
                color: dark ? '#fff' : '#000',
                background: dark ? '#000' : '#fff'}}>
                <TestDraggable />
                {children}
              </div>
            </ContentElementEditorStateProvider>
          </ContentElementAttributesProvider>
      </EditorStateProvider>
      </DndProvider>
    </RootProviders>
  );
}

function TestDraggable() {
  const [, drag] = useDrag({
    item: {type: 'contentElement'}
  });

  const style = {
    padding: 10,
    border: 'dashed 1px currentColor',
    display: 'inline-block'
  };

  return (
    <div ref={drag} style={style}>
      Drag me to test drop indicators
    </div>
  )
}

const exampleValue = [
  {
    type: 'heading',
    children: [
      {text: 'Heading'}
    ]
  },
  {
    type: 'paragraph',
    children: [
      {text: 'At vero eos et '},
      {
        type: 'link',
        href: 'https://example.com',
        children: [
          {text: 'accusam et'}
        ]
      },
      {text: ' justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. '}
    ]
  },
  {
    type: 'block-quote',
    children: [
      {text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.'}
    ]
  },
  {
    type: 'paragraph',
    children: [
      {text: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'}
    ]
  }
];
