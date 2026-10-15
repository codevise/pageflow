import React from 'react';

import {EditableText} from 'frontend';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import {waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('inline editing EditableText selection transient state', () => {
  useInlineEditingPageObjects();

  beforeEach(() => {
    Range.prototype.getBoundingClientRect = () => document.body.getBoundingClientRect();
    Range.prototype.getClientRects = () => [];
  });

  afterEach(() => {
    delete Range.prototype.getBoundingClientRect;
    delete Range.prototype.getClientRects;
  });

  const value = [
    {type: 'paragraph', children: [{text: 'First paragraph'}]},
    {type: 'paragraph', children: [{text: 'Second paragraph'}]}
  ];

  it('reports selection covering all blocks', async () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} contentElementId={1} selectionRect={true} />,
        typeOptions: {customSelectionRect: true}
      }
    });

    entry.simulateSelectMessage({type: 'contentElement', id: 1, range: [0, 2]});

    await waitFor(() =>
      expect(entry.getTransientContentElementState(1)).toMatchObject({
        editableTextSelectionCoversAllBlocks: true
      })
    );
  });

  it('reports selection not covering all blocks', async () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} contentElementId={1} selectionRect={true} />,
        typeOptions: {customSelectionRect: true}
      }
    });

    entry.simulateSelectMessage({type: 'contentElement', id: 1, range: [1, 2]});

    await waitFor(() =>
      expect(entry.getTransientContentElementState(1)).toMatchObject({
        editableTextSelectionCoversAllBlocks: false
      })
    );
  });
});
