import {Link} from 'frontend/Link';

import React from 'react';

import {renderInEntry} from 'support';
import '@testing-library/jest-dom/extend-expect';

describe('Link', () => {
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
