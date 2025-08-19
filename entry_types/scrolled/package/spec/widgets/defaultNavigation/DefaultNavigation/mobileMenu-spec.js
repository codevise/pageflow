import React from 'react';

import {DefaultNavigation} from 'widgets/defaultNavigation/DefaultNavigation';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import styles from 'widgets/defaultNavigation/DefaultNavigation.module.css';

describe('DefaultNavigation - Mobile Menu', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.navigation.open_mobile_menu': 'Open mobile menu'
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

  it('does not render mobile menu button if all chapters are hidden', () => {
    const {queryByRole} = renderInEntry(
      <DefaultNavigation configuration={{}} />,
      {
        seed: {
          chapters: [
            {configuration: {hideInNavigation: true}},
            {configuration: {hideInNavigation: true}}
          ]
        }
      }
    );

    expect(queryByRole('button', {name: 'Open mobile menu'})).toBeNull();
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

  it('keeps mobile menu hidden if custom mobile menu is present', async () => {
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
