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

  it('sets aria-current on current chapter link', () => {
    const {getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}} />,
      {
        seed: {
          chapters: [
            {id: 1, configuration: {title: 'First chapter'}},
            {id: 2, configuration: {title: 'Second chapter'}}
          ],
          sections: [
            {chapterId: 1},
            {chapterId: 2}
          ]
        }
      }
    );

    const firstChapterLink = getByRole('link', {name: 'First chapter'});
    const secondChapterLink = getByRole('link', {name: 'Second chapter'});

    expect(firstChapterLink.getAttribute('aria-current')).toBe('location');
    expect(secondChapterLink.getAttribute('aria-current')).toBeNull();
  });
});