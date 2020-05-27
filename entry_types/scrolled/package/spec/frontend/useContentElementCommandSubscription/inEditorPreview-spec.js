import {frontend, Entry, useContentElementEditorCommandSubscription} from 'pageflow-scrolled/frontend';
import {renderInEntry, fakeParentWindow, tick} from 'support';

import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {loadInlineEditingComponents} from 'frontend/inlineEditing';

describe('useContentElementEditorCommandSubscription in editor preview', () => {
  beforeAll(loadInlineEditingComponents);

  it('invokes callback for content element commands sent via post message', async () => {
    fakeParentWindow();
    const callback = jest.fn();
    frontend.contentElementTypes.register('test', {
      component: function Test({configuration}) {
        useContentElementEditorCommandSubscription(callback);
        return null;
      }
    });

    renderInEntry(<Entry />, {
      seed: {
        contentElements: [{id: 5, typeName: 'test'}]
      }
    });
    const command = {type: 'SOME_COMMAND'};
    window.postMessage({
      type: 'CONTENT_ELEMENT_EDITOR_COMMAND',
      payload: {
        contentElementId: 5,
        command
      }
    }, '*');
    await tick();

    expect(callback).toHaveBeenCalledWith(command);
  });
});
