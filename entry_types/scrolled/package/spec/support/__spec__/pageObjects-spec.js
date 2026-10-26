import React from 'react';

import {renderEntry, usePageObjects} from '../pageObjects';

describe('renderEntry', () => {
  usePageObjects();

  it('renders content element passed via contentElement option', () => {
    const {getByText} = renderEntry({
      contentElement: {ui: <div>Some content</div>}
    });

    expect(getByText('Some content')).not.toBeNull();
  });

  it('supports combining contentElement option with seed without content elements', () => {
    const {getByText} = renderEntry({
      seed: {linkedEntries: [{id: 7, title: 'Other story'}]},
      contentElement: {ui: <div>Some content</div>}
    });

    expect(getByText('Some content')).not.toBeNull();
  });

  it('throws when combining contentElement option with seeded content elements', () => {
    expect(() =>
      renderEntry({
        seed: {contentElements: [{typeName: 'withTestId'}]},
        contentElement: {ui: <div>Some content</div>}
      })
    ).toThrow(/contentElement option/);
  });
});
