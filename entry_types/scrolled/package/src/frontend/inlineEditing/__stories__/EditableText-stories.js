import React from 'react';

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
      <EditorStateProvider>
        <ContentElementAttributesProvider id={1}>
          <ContentElementEditorStateProvider id={1}>
            <div style={{
              width: 500,
              padding: '50px 20px',
              color: dark ? '#fff' : '#000',
              background: dark ? '#000' : '#fff'}}>
              {children}
            </div>
          </ContentElementEditorStateProvider>
        </ContentElementAttributesProvider>
      </EditorStateProvider>
    </RootProviders>
  );
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
