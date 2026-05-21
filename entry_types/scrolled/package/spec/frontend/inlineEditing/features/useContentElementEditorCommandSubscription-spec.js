import React from 'react';

import {useContentElementEditorCommandSubscription} from 'pageflow-scrolled/frontend';
import {tick} from 'support';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import '@testing-library/jest-dom/extend-expect';

describe('inline editing useContentElementEditorCommandSubscription', () => {
  useInlineEditingPageObjects();

  it('invokes callback for content element commands sent via post message', async () => {
    const callback = jest.fn();

    function Test() {
      useContentElementEditorCommandSubscription(callback);
      return null;
    }

    renderEntry({
      contentElement: {ui: <Test />}
    });

    const command = {type: 'SOME_COMMAND'};
    window.postMessage({
      type: 'CONTENT_ELEMENT_EDITOR_COMMAND',
      payload: {
        contentElementId: 1,
        command
      }
    }, '*');
    await tick();

    expect(callback).toHaveBeenCalledWith(command);
  });
});
