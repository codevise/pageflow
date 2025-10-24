import React from 'react';

import {DefaultNavigation} from 'widgets/defaultNavigation/DefaultNavigation';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import styles from 'widgets/defaultNavigation/DefaultNavigation.module.css';
import hamburgerStyles from 'widgets/defaultNavigation/HamburgerIcon.module.css';

describe('DefaultNavigation - Menu', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.navigation.open_mobile_menu': 'Open mobile menu'
  });

  it('renders menu button when Menu prop is provided', () => {
    const Menu = () => <div>Menu</div>;
    const {queryByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         Menu={Menu} />
    );

    expect(queryByRole('button', {name: 'Open mobile menu'})).not.toBeNull();
  });

  it('passes open prop to Menu component', async () => {
    const Menu = ({open}) => <div>Menu {open ? 'open' : 'closed'}</div>;
    const {queryByText, getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         Menu={Menu} />
    );

    expect(queryByText('Menu closed')).not.toBeNull();

    const user = userEvent.setup();
    await user.click(getByRole('button', {name: 'Open mobile menu'}));

    expect(queryByText('Menu open')).not.toBeNull();
  });

  it('passes close prop to Menu component', async () => {
    const Menu = ({open, close}) => (
      <div>
        <div>Menu {open ? 'open' : 'closed'}</div>
        <button onClick={close}>Close menu</button>
      </div>
    );
    const {queryByText, getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         Menu={Menu} />
    );

    const user = userEvent.setup();
    await user.click(getByRole('button', {name: 'Open mobile menu'}));
    expect(queryByText('Menu open')).not.toBeNull();

    await user.click(getByRole('button', {name: 'Close menu'}));
    expect(queryByText('Menu closed')).not.toBeNull();
  });

  it('passes widget configuration to Menu component', () => {
    const Menu = ({configuration}) => <div>{configuration.menuTitle}</div>;
    const {queryByText} = renderInEntry(
      <DefaultNavigation configuration={{menuTitle: 'Custom title'}}
                         Menu={Menu} />
    );

    expect(queryByText('Custom title')).not.toBeNull();
  });

  it('Menu takes precedence over MobileMenu when both are provided', () => {
    const Menu = () => <div>Menu component</div>;
    const MobileMenu = () => <div>MobileMenu component</div>;
    const {queryByText} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         Menu={Menu}
                         MobileMenu={MobileMenu} />
    );

    expect(queryByText('Menu component')).not.toBeNull();
    expect(queryByText('MobileMenu component')).toBeNull();
  });

  it('hides default chapter navigation when Menu is present', async () => {
    const Menu = () => <div>Menu</div>;
    const {getByRole} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         Menu={Menu} />,
      {
        seed: {
          chapters: [{}, {}]
        }
      }
    );

    expect(getByRole('navigation')).toHaveClass(styles.navigationChaptersHidden);
  });

  it('adds hasDesktopMenu class to navigation bar', () => {
    const Menu = () => <div>Menu</div>;
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         Menu={Menu} />
    );

    const header = container.querySelector('header');
    expect(header).toHaveClass(styles.hasDesktopMenu);
  });

  it('does not add hasDesktopMenu class when MobileMenu is used', () => {
    const MobileMenu = () => <div>Mobile Menu</div>;
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         MobileMenu={MobileMenu} />
    );

    const header = container.querySelector('header');
    expect(header).not.toHaveClass(styles.hasDesktopMenu);
  });

  it('hamburger icon is visible on desktop when Menu is used', () => {
    const Menu = () => <div>Menu</div>;
    const {container} = renderInEntry(
      <DefaultNavigation configuration={{}}
                         Menu={Menu} />
    );

    const hamburgerContainer = container.querySelector(`.${hamburgerStyles.burgerMenuIconContainer}`);
    expect(hamburgerContainer).toHaveClass(hamburgerStyles.visibleOnDesktop);
  });
});
