import React from 'react';

import {Layout} from 'frontend/layouts';
import {frontend} from 'pageflow-scrolled/frontend';

import centerStyles from 'frontend/layouts/Center.module.css';

import {render} from '@testing-library/react';

import {useNarrowViewport} from 'frontend/useNarrowViewport';
jest.mock('frontend/useNarrowViewport');

describe('Layout', () => {
  beforeEach(() => useNarrowViewport.mockReturnValue(false));

  describe('placeholder', () => {
    it('renders in two column variant', () => {
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'left'}}
                items={[]}
                placeholder={<div data-testid="placeholder" />} />
      );

      expect(getByTestId('placeholder')).not.toBeNull();
    });

    it('renders placeholder in center variant', () => {
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}}
                items={[]}
                placeholder={<div data-testid="placeholder" />} />
      );

      expect(getByTestId('placeholder')).not.toBeNull();
    });
  });

  describe('children render prop', () => {
    beforeAll(() => {
      frontend.contentElementTypes.register('probe', {
        component: function Probe({contentElementId}) {
          return (
            <div>{contentElementId} </div>
          );
        }
      });
    });

    // How to read these tests:
    // - "( 1 2 3 )" is a box with three elements
    // - "( 1 2 3 |" is a box with an "open end".
    // - "| 1 2 3 )" is a box with an "open start".
    // The idea is that two adjacent boxes with open end and open start
    // respectively "( 1 2 3 || 4 )" will look like a single box.
    const Box = function Box({openStart, openEnd, children}) {
      return (
        <div>{openStart ? '|' : '('} {children}{openEnd ? '|' : ')'}</div>
      );
    }

    describe('in two column variant', () => {
      it('is called for each group of consecutive items with same position passing position', () => {
        const items = [
          {id: 1, type: 'probe', position: 'wide'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline'},
          {id: 4, type: 'probe', position: 'inline'},
          {id: 5, type: 'probe', position: 'sticky'},
          {id: 6, type: 'probe', position: 'sticky'},
          {id: 7, type: 'probe', position: 'inline'},
          {id: 8, type: 'probe', position: 'full'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position}) => <div>{position} {children}</div>}
          </Layout>
        );

        expect(container.textContent).toEqual('wide 1 inline 2 3 4 sticky 5 6 inline 7 full 8 ');
      });

      it('continues inline group after being interrupted by sticky group', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'sticky'},
          {id: 4, type: 'probe', position: 'sticky'},
          {id: 5, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 2 |( 3 4 )| 5 )');
      });

      it('does not continue inline group after being interrupted by full group', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'full'},
          {id: 4, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 2 )( 3 )( 4 )');
      });

      it('does not continue inline group after being interrupted by wide group', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'wide'},
          {id: 4, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 2 )( 3 )( 4 )');
      });

      it('does not continue inline group after being interrupted by sticky and full group', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'sticky'},
          {id: 3, type: 'probe', position: 'full'},
          {id: 4, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 )( 2 )( 3 )( 4 )');
      });

      it('does not continue inline group after being interrupted by full and sticky group', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'full'},
          {id: 3, type: 'probe', position: 'sticky'},
          {id: 4, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 )( 2 )( 3 )( 4 )');
      });

      it('inlines sticky element for narrow viewport', () => {
        useNarrowViewport.mockReturnValue(true);

        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'sticky'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 2 3 )');
      });
    });

    describe('in center variant', () => {
      it('calls children for each item passing position', () => {
        const items = [
          {id: 1, type: 'probe', position: 'wide'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'sticky'},
          {id: 4, type: 'probe', position: 'full'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, {position}) => <div>{position} {children}</div>}
          </Layout>
        );

        expect(container.textContent).toEqual('wide 1 inline 2 sticky 3 full 4 ');
      });

      it('renders consecutive inline items with open end/open start', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 || 2 || 3 )');
      });

      it('treats sticky items like inline items', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'sticky'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 || 2 || 3 )');
      });

      it('renders consecutive inline and floated items with open end/open start', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'left'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 || 2 || 3 )');
      });

      it('renders items separated by full item without open end/open start', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'full'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 )( 2 )( 3 )');
      });

      it('renders items separated by wide item without open end/open start', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'wide'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 )( 2 )( 3 )');
      });
    });

    describe('in centerRagged variant', () => {
      it('treats sticky items like inline items', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'sticky'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'centerRagged'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 || 2 || 3 )');
      });
    });
  });

  describe('floating items in centered variant', () => {
    beforeAll(() => {
      frontend.contentElementTypes.register('probe', {
        component: function Probe() {
          return <div data-testid="probe" />;
        }
      });

      frontend.contentElementTypes.register('wrappingProbe', {
        supportsWrappingAroundFloats: true,

        component: function WrappingProbe() {
          return <div data-testid="probe" />;
        }
      });
    });

    it('clears all items by default', () => {
      const items = [
        {id: 1, type: 'probe', position: 'inline'}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles.clear)).not.toBeNull();
    });

    it('does not clear items that support wrapping floated items', () => {
      const items = [
        {id: 1, type: 'wrappingProbe', position: 'inline'}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles.clear)).toBeNull();
    });

    function findParentWithClass(element, className) {
      let currentElement = element;

      while ((currentElement = currentElement.parentElement)) {
        if (currentElement.classList.contains(className)) {
          return currentElement;
        }
      }

      return null;
    }
  });
});
