import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects';
import {within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('backdrop eager loading', () => {
  useInlineEditingPageObjects();

  it('loads image of first section in SSR', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [
          {permaId: 1, configuration: {backdrop: {image: 100}}}
        ],
        fileUrlTemplates: {
          imageFiles: {large: ':basename.jpg'}
        },
        imageFiles: [{permaId: 100, basename: 'image'}],
        additionalSeedData: {
          frontendVersion: 2
        }
      }
    });

    const {getByRole} = within(getSectionByPermaId(1).el);
    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('image.jpg'));
  });

  it('does not load image of section section in SSR', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [
          {},
          {permaId: 2, configuration: {backdrop: {image: 100}}}
        ],
        fileUrlTemplates: {
          imageFiles: {large: ':basename.jpg'}
        },
        imageFiles: [{permaId: 100, basename: 'image'}],
        additionalSeedData: {
          frontendVersion: 2
        }
      }
    });

    const {queryByRole} = within(getSectionByPermaId(2).el);
    expect(queryByRole('img')).toBeNull();
  });
});
