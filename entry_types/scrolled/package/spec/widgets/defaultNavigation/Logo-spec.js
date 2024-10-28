import React from 'react';
import {Logo} from 'widgets/defaultNavigation/Logo';

import '@testing-library/jest-dom/extend-expect';
import {renderInEntry} from 'support';

describe('Logo', () => {
  it('renders desktop logo by default', async () => {
    const {getByRole} = renderInEntry(<Logo />, {
      seed: {
        themeAssets: {
          logoDesktop: 'logoDesktop.svg',
          logoDarkVariantDesktop: 'logoDarkVariantDesktop.svg'
        }
      }
    });

    expect(getByRole('img')).toHaveAttribute('src', 'logoDesktop.svg');
  });

  it('renders dark variant desktop logo in dark widgets mode', async () => {
    const {getByRole} = renderInEntry(<Logo />, {
      seed: {
        entry: {
          configuration: {
            darkWidgets: true
          }
        },
        themeAssets: {
          logoDesktop: 'logoDesktop.svg',
          logoDarkVariantDesktop: 'logoDarkVariantDesktop.svg'
        }
      }
    });

    expect(getByRole('img')).toHaveAttribute('src', 'logoDarkVariantDesktop.svg');
  });
});
