import React from 'react';

import {DefaultNavigation} from 'widgets/defaultNavigation/DefaultNavigation';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import styles from 'widgets/defaultNavigation/DefaultNavigation.module.css';

describe('DefaultNavigation', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.navigation.open_mobile_menu': 'Open mobile menu'
  });

  it('does not have style attribute on header by default', () => {
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{}} />
    );

    expect(container.querySelector('header')).not.toHaveAttribute('style');
  });

  it('supports overriding accent color', () => {
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{accentColor: 'brand-blue'}} />
    );

    expect(container.querySelector('header')).toHaveStyle(
      {'--theme-accent-color': 'var(--theme-palette-color-brand-blue)'
    });
  });

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

  it('supports extra buttons component', () => {
    const ExtraButtons = () => <button>Extra</button>;
    const {queryByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         ExtraButtons={ExtraButtons} />
    );

    expect(queryByRole('button', {name: 'Extra'})).not.toBeNull();
  });

  it('supports alternative mobile menu component', () => {
    const MobileMenu = () => <div>Mobile menu</div>;
    const {queryByText} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         MobileMenu={MobileMenu} />
    );

    expect(queryByText('Mobile menu')).not.toBeNull();
  });

  it('does not render mobile menu button by default', () => {
    const {queryByRole} = renderInEntry(
      <DefaultNavigation configuration={{}} />
    );

    expect(queryByRole('button', {name: 'Open mobile menu'})).toBeNull();
  });

  it('render mobile menu button if chapters are present', () => {
    const {queryByRole} = renderInEntry(
      <DefaultNavigation configuration={{}} />,
      {
        seed: {
          chapters: [{}, {}]
        }
      }
    );

    expect(queryByRole('button', {name: 'Open mobile menu'})).not.toBeNull();
  });

  it('toggles class to show and hide mobile menu', async () => {
    const {getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}} />,
      {
        seed: {
          chapters: [{}, {}]
        }
      }
    );

    expect(getByRole('navigation')).toHaveClass(styles.navigationChaptersHidden);

    const user = userEvent.setup();
    await user.click(getByRole('button', {name: 'Open mobile menu'}));

    expect(getByRole('navigation')).not.toHaveClass(styles.navigationChaptersHidden);
  });

  it('keeps mobile menu hidden if custom mobile is present', async () => {
    const MobileMenu = () => <div>Mobile menu</div>;
    const {getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         MobileMenu={MobileMenu} />,
      {
        seed: {
          chapters: [{}, {}]
        }
      }
    );

    expect(getByRole('navigation')).toHaveClass(styles.navigationChaptersHidden);

    const user = userEvent.setup();
    await user.click(getByRole('button', {name: 'Open mobile menu'}));

    expect(getByRole('navigation')).toHaveClass(styles.navigationChaptersHidden);
  });

  it('renders mobile menu button if custom mobile menu is present', () => {
    const MobileMenu = () => <div>Mobile menu</div>;
    const {queryByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         MobileMenu={MobileMenu} />
    );

    expect(queryByRole('button', {name: 'Open mobile menu'})).not.toBeNull();
  });

  it('passes open prop to custom mobile menu component', async () => {
    const MobileMenu = ({open}) => <div>Mobile menu {open ? 'open' : 'closed'}</div>;
    const {queryByText, getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         MobileMenu={MobileMenu} />
    );

    expect(queryByText('Mobile menu closed')).not.toBeNull();

    const user = userEvent.setup();
    await user.click(getByRole('button', {name: 'Open mobile menu'}));

    expect(queryByText('Mobile menu open')).not.toBeNull();
  });

  it('passes close prop to custom mobile menu component', async () => {
    const MobileMenu = ({open, close}) => (
      <div>
        <div>Mobile menu {open ? 'open' : 'closed'}</div>
        <button onClick={close}>Close mobile menu</button>;
      </div>
    );
    const {queryByText, getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         MobileMenu={MobileMenu} />
    );

    const user = userEvent.setup();
    await user.click(getByRole('button', {name: 'Open mobile menu'}));
    expect(queryByText('Mobile menu open')).not.toBeNull();

    await user.click(getByRole('button', {name: 'Close mobile menu'}));
    expect(queryByText('Mobile menu closed')).not.toBeNull();
  });

  it('passes widget configuration to custom mobile menu component', () => {
    const MobileMenu = ({configuration}) => <div>{configuration.mobileMenuTitle}</div>;
    const {queryByText} = renderInEntry(
      <DefaultNavigation configuration={{mobileMenuTitle: 'Some title'}}
                         MobileMenu={MobileMenu} />
    );

    expect(queryByText('Some title')).not.toBeNull();
  });
});
