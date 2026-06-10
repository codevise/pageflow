import React from 'react';

import {DefaultNavigation} from 'widgets/defaultNavigation/DefaultNavigation';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('DefaultNavigation - Components', () => {
  useFakeTranslations({});

  it('supports extra buttons component', () => {
    const ExtraButtons = () => <button>Extra</button>;
    const {queryByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         ExtraButtons={ExtraButtons} />
    );

    expect(queryByRole('button', {name: 'Extra'})).not.toBeNull();
  });

  it('supports alternative mobile menu component', () => {
    const MobileMenu = () => <div>Mobile menu</div>;
    const {queryByText} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         MobileMenu={MobileMenu} />
    );

    expect(queryByText('Mobile menu')).not.toBeNull();
  });
});