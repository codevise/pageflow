import {frontend, Entry, useContentElementEditorCommandSubscription} from 'pageflow-scrolled/frontend';
import {renderInEntry} from 'support';

import React from 'react';
import '@testing-library/jest-dom/extend-expect'

describe('useContentElementEditorCommandSubscription in frontend', () => {
  it('is noop', async () => {
    frontend.contentElementTypes.register('test', {
      component: function Test({configuration}) {
        useContentElementEditorCommandSubscription(() => {});
        return null;
      }
    });

    expect(() =>
      renderInEntry(<Entry />, {
        seed: {
          contentElements: [{id: 5, typeName: 'test'}]
        }
      })
    ).not.toThrow();
  });
});
