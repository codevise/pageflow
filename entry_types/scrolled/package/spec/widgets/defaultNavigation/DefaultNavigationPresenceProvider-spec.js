import React from 'react';

import {DefaultNavigationPresenceProvider} from 'widgets/defaultNavigation/DefaultNavigationPresenceProvider';

import styles from 'widgets/defaultNavigation/presenceClassNames.module.css';

import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import {act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('DefaultNavigationPresenceProvider', () => {
  afterEach(() => jest.restoreAllMocks());
  it('renders wrapper with class setting --widget-margin-top-max by default', () => {
    const {container} = renderInEntry(
      <DefaultNavigationPresenceProvider configuration={{}}>
        <div />
      </DefaultNavigationPresenceProvider>
    );

    expect(container.firstChild).toHaveClass(styles.widgetMarginMax);
  });

  it(
    'renders wrapper with class additionally setting --widget-margin-top-min ' +
    'if both firstBackdropBelowNavigation and fixedOnDesktop are set',
    () => {
      const {container} = renderInEntry(
        <DefaultNavigationPresenceProvider configuration={{
          firstBackdropBelowNavigation: true,
          fixedOnDesktop: true
        }}>
          <div />
        </DefaultNavigationPresenceProvider>
      );

      expect(container.firstChild).toHaveClass(styles.widgetMarginMax);
      expect(container.firstChild).toHaveClass(styles.widgetMarginMin);
    }
  );

  it(
    'does not render min class on phone platform',
    () => {
      const {container} = renderInEntry(
        <DefaultNavigationPresenceProvider configuration={{
          firstBackdropBelowNavigation: true,
          fixedOnDesktop: true
        }}>
          <div />
        </DefaultNavigationPresenceProvider>,
        {phonePlatform: true}
      );

      expect(container.firstChild).toHaveClass(styles.widgetMarginMax);
      expect(container.firstChild).not.toHaveClass(styles.widgetMarginMin);
    }
  );

  it('renders wrapper with expanded class by default', () => {
    const {container} = renderInEntry(
      <DefaultNavigationPresenceProvider configuration={{}}>
        <div />
      </DefaultNavigationPresenceProvider>
    );

    expect(container.firstChild).toHaveClass(styles.expanded);
  });

  it('toggles expanded class based on scroll direction', () => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0
    });

    jest.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({
      top: -window.scrollY,
      left: 0,
      right: 1024,
      bottom: 768 - window.scrollY,
      width: 1024,
      height: 768
    }));

    const {container} = renderInEntry(
      <DefaultNavigationPresenceProvider configuration={{}}>
        <div />
      </DefaultNavigationPresenceProvider>
    );

    expect(container.firstChild).toHaveClass(styles.expanded);

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(container.firstChild).not.toHaveClass(styles.expanded);

    act(() => {
      window.scrollY = 50;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(container.firstChild).toHaveClass(styles.expanded);
  });
});
