import {ExternalLink} from 'contentElements/externalLinkList/frontend/ExternalLink';

import React from 'react';

import {renderInEntry} from 'support';
import '@testing-library/jest-dom/extend-expect';

describe('ExternalLink', () => {
  it('does not render url without protocol', () => {
    const {getByRole} = renderInEntry(<ExternalLink url="example.com" />)

    expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
  });

  it('preserves http url protocol', () => {
    const {getByRole} = renderInEntry(<ExternalLink url="http://example.com" />)

    expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
  });

  it('preserves protocol relative urls', () => {
    const {getByRole} = renderInEntry(<ExternalLink url="//example.com" />)

    expect(getByRole('link')).toHaveAttribute('href', '//example.com');
  });

  it('preserves https url protocol', () => {
    const {getByRole} = renderInEntry(<ExternalLink url="https://example.com" />)

    expect(getByRole('link')).toHaveAttribute('href', 'https://example.com');
  });
});
