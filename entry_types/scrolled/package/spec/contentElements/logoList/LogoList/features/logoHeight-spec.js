import React from 'react';

import {LogoList} from 'contentElements/logoList/LogoList';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

describe('LogoList logo height', () => {
  const seed = {
    imageFileUrlTemplates: {medium: ':id_partition/medium/image.webp'},
    imageFiles: [{id: 1, permaId: 100}]
  };

  const items = [{id: 1, image: 100}];

  function renderLogoList(configuration) {
    const result = renderInContentElement(
      <LogoList configuration={configuration} contentElementId={1} />,
      {seed}
    );

    result.simulateScrollPosition('near viewport');

    return result;
  }

  it('uses theme scale property for logo height', () => {
    const {container} = renderLogoList({items, logoHeight: 'lg'});

    expect(container.querySelector('ul'))
      .toHaveStyle('--logo-height: var(--theme-logo-list-logo-height-lg)');
  });

  it('does not set logo height by default', () => {
    const {container} = renderLogoList({items});

    expect(container.querySelector('ul').style.getPropertyValue('--logo-height'))
      .toBe('');
  });
});
