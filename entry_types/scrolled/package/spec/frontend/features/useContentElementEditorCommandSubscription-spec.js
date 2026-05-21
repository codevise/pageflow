import React from 'react';

import {useContentElementEditorCommandSubscription} from 'pageflow-scrolled/frontend';
import {renderEntry, usePageObjects} from 'support/pageObjects';

import '@testing-library/jest-dom/extend-expect';

describe('useContentElementEditorCommandSubscription', () => {
  usePageObjects();

  it('is noop', () => {
    function Test() {
      useContentElementEditorCommandSubscription(() => {});
      return null;
    }

    expect(() =>
      renderEntry({
        contentElement: {ui: <Test />}
      })
    ).not.toThrow();
  });
});
