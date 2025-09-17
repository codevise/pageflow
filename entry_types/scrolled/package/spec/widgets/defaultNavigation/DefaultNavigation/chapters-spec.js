import React from 'react';

import {DefaultNavigation} from 'widgets/defaultNavigation/DefaultNavigation';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('DefaultNavigation - Chapters', () => {
  useFakeTranslations({});

  it('does not render chapters that have hide in navigation flag', () => {
    const {queryByRole} = renderInEntry(
      <DefaultNavigation configuration={{}} />,
      {
        seed: {
          chapters: [
            {configuration: {title: 'First chapter'}},
            {configuration: {title: 'Hidden chapter', hideInNavigation: true}},
            {configuration: {title: 'Second chapter'}}
          ]
        }
      }
    );

    expect(queryByRole('link', {name: 'First chapter'})).not.toBeNull();
    expect(queryByRole('link', {name: 'Second chapter'})).not.toBeNull();
    expect(queryByRole('link', {name: 'Hidden chapter'})).toBeNull();
  });
});