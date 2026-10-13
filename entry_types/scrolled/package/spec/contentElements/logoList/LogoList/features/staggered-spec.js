import React from 'react';

import {LogoList} from 'contentElements/logoList/LogoList';
import styles from 'contentElements/logoList/LogoList.module.css';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect'

describe('LogoList staggered', () => {
  const seed = {
    imageFileUrlTemplates: {medium: ':id_partition/medium/image.webp'},
    imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
  };

  const items = [{id: 1, image: 100}, {id: 2, image: 101}];

  function renderLogoList(configuration, options = {}) {
    const result = renderInContentElement(
      <LogoList configuration={configuration} contentElementId={1} />,
      {seed, ...options}
    );

    result.simulateScrollPosition('near viewport');

    return result;
  }

  it('supports staggered logos', () => {
    const {container} = renderLogoList({items, staggered: true});

    expect(container.querySelector(`.${styles.staggered}`)).not.toBeNull();
  });
});
