import React from 'react';

import {DefaultNavigation} from 'widgets/defaultNavigation/DefaultNavigation';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('DefaultNavigation - Logo', () => {
  useFakeTranslations({});

  it('uses theme logo by default', () => {
    const {getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}} />,
      {
        seed: {
          themeAssets: {
            logoDesktop: 'logo-desktop.png'
          },
          themeOptions: {
            logoUrl: 'https://example.com',
            logoAltText: 'My logo'
          }
        }
      }
    );

    expect(getByRole('link', {name: 'My logo'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'My logo'})).toHaveAttribute('href', 'https://example.com');
    expect(getByRole('link', {name: 'My logo'})).toHaveAttribute('target', '_blank');
    expect(getByRole('img', {name: 'My logo'})).toHaveAttribute('src', 'logo-desktop.png');
  });

  it('supports opening logo link in same tab', () => {
    const {getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}} />,
      {
        seed: {
          themeAssets: {
            logoDesktop: 'logo-desktop.png'
          },
          themeOptions: {
            logoUrl: 'https://example.com',
            logoAltText: 'My logo',
            logoOpenInSameTab: true
          }
        }
      }
    );

    expect(getByRole('link', {name: 'My logo'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'My logo'})).toHaveAttribute('href', 'https://example.com');
    expect(getByRole('link', {name: 'My logo'})).not.toHaveAttribute('target');
  });

  it('takes logo props', () => {
    const {getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         logo={{
                           srcDesktop: "other-logo.png",
                           url: "https://other.example.com",
                           altText: "Other logo"
                         }} />,
      {
        seed: {
          themeAssets: {
            logoDesktop: 'logo.png'
          },
          themeOptions: {
            logoUrl: 'https://exmaple.com',
            logoAltText: 'My logo'
          }
        }
      }
    );

    expect(getByRole('link', {name: 'Other logo'})).toBeInTheDocument();
    expect(getByRole('link', {name: 'Other logo'})).toHaveAttribute('href', 'https://other.example.com');
    expect(getByRole('img', {name: 'Other logo'})).toHaveAttribute('src', 'other-logo.png');
  });
});