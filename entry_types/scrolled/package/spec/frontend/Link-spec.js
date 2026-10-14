import {Link} from 'frontend/Link';
import {useActiveExcursion} from 'frontend/useActiveExcursion';

import React from 'react';
import {act, fireEvent} from '@testing-library/react';

import {renderInEntry} from 'support';
import {changeLocationHash} from 'support/changeLocationHash';
import '@testing-library/jest-dom/extend-expect';

describe('Link', () => {
  beforeEach(() => {
    window.location.hash = '#initial';
  });

  describe('with string href', () => {
    it('does not set target by default', () => {
      const {getByRole} = renderInEntry(
        <Link href="http://example.com">Click</Link>
      );

      expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
      expect(getByRole('link')).not.toHaveAttribute('target');
    });

    it('sets target _blank when openInNewTab is true', () => {
      const {getByRole} = renderInEntry(
        <Link href="http://example.com" openInNewTab>Click</Link>
      );

      expect(getByRole('link')).toHaveAttribute('target', '_blank');
    });

    describe('in embed mode', () => {
      it('sets target _top for external link', () => {
        const {getByRole} = renderInEntry(
          <Link href="http://other.com/page">Click</Link>,
          {
            seed: {
              embed: true,
              originUrl: 'http://example.com/my-entry'
            }
          }
        );

        expect(getByRole('link')).toHaveAttribute('target', '_top');
      });

      it('does not set target for link starting with origin url', () => {
        const {getByRole} = renderInEntry(
          <Link href="http://example.com/my-entry#section">Click</Link>,
          {
            seed: {
              embed: true,
              originUrl: 'http://example.com/my-entry'
            }
          }
        );

        expect(getByRole('link')).not.toHaveAttribute('target');
      });

      it('does not set target for fragment-only link', () => {
        const {getByRole} = renderInEntry(
          <Link href="#section-5">Click</Link>,
          {
            seed: {
              embed: true,
              originUrl: 'http://example.com/my-entry'
            }
          }
        );

        expect(getByRole('link')).not.toHaveAttribute('target');
      });

      it('prefers openInNewTab over embed mode target', () => {
        const {getByRole} = renderInEntry(
          <Link href="http://other.com/page" openInNewTab>Click</Link>,
          {
            seed: {
              embed: true,
              originUrl: 'http://example.com/my-entry'
            }
          }
        );

        expect(getByRole('link')).toHaveAttribute('target', '_blank');
      });
    });
  });

  describe('with chapter href', () => {
    it('renders link to chapter slug', () => {
      const {getByRole} = renderInEntry(
        <Link href={{chapter: 10}}>Click</Link>,
        {
          seed: {
            chapters: [{id: 1, permaId: 10, configuration: {title: 'The Intro'}}]
          }
        }
      );

      expect(getByRole('link')).toHaveAttribute('href', '#the-intro');
      expect(getByRole('link')).not.toHaveAttribute('target');
    });

    it('activates excursion without native fragment navigation', () => {
      const {getByRole, getByTestId} = renderInEntry(
        <>
          <Link href={{chapter: 11}}>Click</Link>
          <ActiveExcursionTitle />
        </>,
        {seed: storylinesSeed}
      );

      const defaultPrevented = !fireEvent.click(getByRole('link'));

      expect(defaultPrevented).toBe(true);
      expect(window.location.hash).toEqual('#excursion');
      expect(getByTestId('activeExcursion')).toHaveTextContent('excursion');
    });

    it('keeps native fragment navigation for main storyline chapter', () => {
      const {getByRole} = renderInEntry(
        <Link href={{chapter: 10}}>Click</Link>,
        {seed: storylinesSeed}
      );

      const defaultPrevented = !fireEvent.click(getByRole('link'));

      expect(defaultPrevented).toBe(false);
    });

    it('calls onClick passed via attributes', () => {
      const onClick = jest.fn();
      const {getByRole} = renderInEntry(
        <Link href={{chapter: 11}} attributes={{onClick}}>Click</Link>,
        {seed: storylinesSeed}
      );

      fireEvent.click(getByRole('link'));

      expect(onClick).toHaveBeenCalled();
    });

    it('keeps default prevented by onClick passed via attributes', () => {
      const {getByRole, getByTestId} = renderInEntry(
        <>
          <Link href={{chapter: 11}}
                attributes={{onClick: event => event.preventDefault()}}>
            Click
          </Link>
          <ActiveExcursionTitle />
        </>,
        {seed: storylinesSeed}
      );

      fireEvent.click(getByRole('link'));

      expect(getByTestId('activeExcursion')).toHaveTextContent('none');
    });

    it('keeps native behavior when clicked with modifier key', () => {
      const {getByRole} = renderInEntry(
        <Link href={{chapter: 11}}>Click</Link>,
        {seed: storylinesSeed}
      );

      const defaultPrevented = !fireEvent.click(getByRole('link'), {metaKey: true});

      expect(defaultPrevented).toBe(false);
    });
  });

  describe('with section href', () => {
    it('renders link to section anchor', () => {
      const {getByRole} = renderInEntry(
        <Link href={{section: 10}}>Click</Link>,
        {
          seed: {
            sections: [{id: 1, permaId: 10}]
          }
        }
      );

      expect(getByRole('link')).toHaveAttribute('href', '#section-10');
      expect(getByRole('link')).not.toHaveAttribute('target');
    });

    it('activates excursion without native fragment navigation', () => {
      const {getByRole, getByTestId} = renderInEntry(
        <>
          <Link href={{section: 1010}}>Click</Link>
          <ActiveExcursionTitle />
        </>,
        {seed: storylinesSeed}
      );

      const defaultPrevented = !fireEvent.click(getByRole('link'));

      expect(defaultPrevented).toBe(true);
      expect(window.location.hash).toEqual('#section-1010');
      expect(getByTestId('activeExcursion')).toHaveTextContent('excursion');
    });

    it('keeps native fragment navigation for main storyline section', () => {
      const {getByRole} = renderInEntry(
        <Link href={{section: 1000}}>Click</Link>,
        {seed: storylinesSeed}
      );

      const defaultPrevented = !fireEvent.click(getByRole('link'));

      expect(defaultPrevented).toBe(false);
    });

    it('returns from excursion without native fragment navigation', () => {
      const {getByRole, getByTestId} = renderInEntry(
        <>
          <Link href={{section: 1000}}>Click</Link>
          <ActiveExcursionTitle />
        </>,
        {seed: storylinesSeed}
      );

      act(() => changeLocationHash('#excursion'));
      const defaultPrevented = !fireEvent.click(getByRole('link'));

      expect(defaultPrevented).toBe(true);
      expect(window.location.hash).toEqual('#section-1000');
      expect(getByTestId('activeExcursion')).toHaveTextContent('none');
    });
  });

  describe('with href to other entry', () => {
    it('renders link to linked entry', () => {
      const {getByRole} = renderInEntry(
        <Link href={{entry: 5}}>Click</Link>,
        {
          seed: {
            linkedEntries: [{id: 5, url: 'http://example.com/other'}]
          }
        }
      );

      expect(getByRole('link')).toHaveAttribute('href', 'http://example.com/other');
      expect(getByRole('link')).not.toHaveAttribute('target');
    });

    it('renders link without href for unknown entry', () => {
      const {getByText} = renderInEntry(
        <Link href={{entry: 5}}>Click</Link>
      );

      expect(getByText('Click')).not.toHaveAttribute('href');
    });

    it('sets target _top in embed mode', () => {
      const {getByRole} = renderInEntry(
        <Link href={{entry: 5}}>Click</Link>,
        {
          seed: {
            embed: true,
            originUrl: 'http://example.com/my-entry',
            linkedEntries: [{id: 5, url: 'http://example.com/other'}]
          }
        }
      );

      expect(getByRole('link')).toHaveAttribute('target', '_top');
    });

    it('sets target _blank when openInNewTab is true', () => {
      const {getByRole} = renderInEntry(
        <Link href={{entry: 5}} openInNewTab>Click</Link>,
        {
          seed: {
            linkedEntries: [{id: 5, url: 'http://example.com/other'}]
          }
        }
      );

      expect(getByRole('link')).toHaveAttribute('target', '_blank');
    });
  });

  describe('with file href', () => {
    it('renders download link with target blank', () => {
      const {getByRole} = renderInEntry(
        <Link href={{file: {permaId: 100, collectionName: 'imageFiles'}}}>Click</Link>,
        {
          seed: {
            imageFileUrlTemplates: {
              original: ':id_partition/original/:basename.:extension'
            },
            imageFiles: [{id: 1, permaId: 100, displayName: 'Some File.jpg'}]
          }
        }
      );

      expect(getByRole('link')).toHaveAttribute(
        'href',
        '000/000/001/original/image.jpg?download=Some%20File.jpg'
      );
      expect(getByRole('link')).toHaveAttribute('target', '_blank');
      expect(getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});

const storylinesSeed = {
  storylines: [
    {id: 1, configuration: {main: true}},
    {id: 2}
  ],
  chapters: [
    {id: 10, permaId: 10, storylineId: 1, configuration: {title: 'intro'}},
    {id: 11, permaId: 11, storylineId: 2, configuration: {title: 'excursion'}}
  ],
  sections: [
    {id: 100, permaId: 1000, chapterId: 10},
    {id: 101, permaId: 1010, chapterId: 11}
  ]
};

function ActiveExcursionTitle() {
  const {activeExcursion} = useActiveExcursion();

  return (
    <div data-testid="activeExcursion">
      {activeExcursion ? activeExcursion.title : 'none'}
    </div>
  );
}
