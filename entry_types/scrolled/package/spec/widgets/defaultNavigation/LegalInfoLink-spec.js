import React from 'react';

import {LegalInfoLink} from 'widgets/defaultNavigation/LegalInfoLink';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('LegalInfoLink', () => {
  it('renders target blank by default', () => {
    const {getByRole} = render(
      <LegalInfoLink label="Copyright" url="https://example.com" />
    );

    expect(getByRole('link')).toHaveTextContent('Copyright');
    expect(getByRole('link')).toHaveAttribute('href', 'https://example.com');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('supports javascript url scheme', () => {
    const {getByRole} = render(
      // eslint-disable-next-line no-script-url
      <LegalInfoLink label="Copyright" url="javascript:pageflowDisplayPrivacySettings()" />
    )

    expect(getByRole('link')).toHaveTextContent('Copyright');
    expect(getByRole('link')).toHaveAttribute('href', '#privacySettings');
    expect(getByRole('link')).not.toHaveAttribute('target');
    expect(getByRole('link')).not.toHaveAttribute('rel');
  });
});
