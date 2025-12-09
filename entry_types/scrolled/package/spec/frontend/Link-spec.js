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
});
