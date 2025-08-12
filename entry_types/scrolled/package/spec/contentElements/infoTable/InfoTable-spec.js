import React from 'react';

import {InfoTable} from 'contentElements/infoTable/InfoTable';
import styles from 'contentElements/infoTable/InfoTable.module.css';
import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('InfoTable', () => {
  it('applies class for configured single column alignment', () => {
    const configuration = {
      singleColumnInPhoneLayout: true,
      singleColumnAlign: 'right',
      value: []
    };

    const {getByRole} = renderInContentElement(
      <InfoTable configuration={configuration} sectionProps={{}} />,
      {seed: {}}
    );

    expect(getByRole('table')).toHaveClass(styles['singleColumnAlign-right']);
  });

  it('applies center ckass in centerRagged layout', () => {
    const configuration = {
      singleColumnInPhoneLayout: true,
      value: []
    };

    const {getByRole} = renderInContentElement(
      <InfoTable configuration={configuration} sectionProps={{layout: 'centerRagged'}} />,
      {seed: {}}
    );

    expect(getByRole('table')).toHaveClass(styles.center);
  });
});
