import React from 'react';

import {Layout} from 'frontend/layouts';
import {TwoColumn} from 'frontend/layouts/TwoColumn';
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

      frontend.contentElementTypes.register('probeWithCustomMargin', {
        customMargin: true,

        component: function Probe({contentElementId}) {
          return (
            <div>{contentElementId} </div>
          );
        }
      });

      frontend.contentElementTypes.register('probeWithCustomMarginProp', {
        customMargin: true,

        component: function Probe({customMargin, contentElementId}) {
          return (
            <div>{customMargin ? 'custom' : 'normal'} {contentElementId} </div>
          );
        }
      });
    });

    // How to read these tests:
    // - "[...]" represents a group. Inline and sticky boxes are
    //    grouped together to allow displaying sticky elements next
    //    to inline boxes.
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
      TwoColumn.GroupComponent = function({children}) {
        return (
          <div>[{children}]</div>
        );
      }

      it('is called for each sequence of consecutive items with same position passing position', () => {
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

        expect(container.textContent).toEqual('[wide 1 ][inline 2 3 4 ][sticky 5 6 inline 7 ][full 8 ]');
      });

      it('places inline elements with custom margin in separate box in same group', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probeWithCustomMargin', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline'}
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, customMargin}) =>
              <div>{position} {customMargin ? 'custom' : 'normal'} {children}</div>
            }
          </Layout>
        );

        expect(container.textContent).toEqual('[inline normal 1 inline custom 2 inline normal 3 ]');
      });

      it('places wide elements with custom margin in separate box in same group', () => {
        const items = [
          {id: 1, type: 'probe', position: 'wide'},
          {id: 2, type: 'probeWithCustomMargin', position: 'wide'},
          {id: 3, type: 'probe', position: 'wide'},
          {id: 4, type: 'probeWithCustomMargin', position: 'wide'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, customMargin}) =>
              <div>{position} {customMargin ? 'custom' : 'normal'} {children}</div>
            }
          </Layout>
        );

        expect(container.textContent).toEqual('[wide normal 1 wide custom 2 wide normal 3 wide custom 4 ]');
      });

      it('does not apply custom margins for sticky elements', () => {
        const items = [
          {id: 1, type: 'probe', position: 'sticky'},
          {id: 2, type: 'probeWithCustomMargin', position: 'sticky'}
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, customMargin}) =>
              <div>{position} {customMargin ? 'custom' : 'normal'} {children}</div>
            }
          </Layout>
        );

        expect(container.textContent).toEqual('[sticky normal 1 2 ]');
      });

      describe('customMargin prop passed to content element', () => {
        it('is true if rendered with custom margin', () => {
          const items = [
            {id: 1, type: 'probeWithCustomMarginProp'}
          ];
          const {container} = render(
            <Layout sectionProps={{layout: 'left'}} items={items}>
              {children => children}
            </Layout>
          );

          expect(container.textContent).toEqual('[custom 1 ]');
        });

        it('is false if rendered custom margin is not supported by position', () => {
          const items = [
            {id: 1, type: 'probeWithCustomMarginProp', position: 'sticky'}
          ];
          const {container} = render(
            <Layout sectionProps={{layout: 'left'}} items={items}>
              {children => children}
            </Layout>
          );

          expect(container.textContent).toEqual('[normal 1 ]');
        });
      });

      it('continues inline box after being interrupted by sticky box', () => {
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

        expect(container.textContent).toEqual('[( 1 2 |][( 3 4 )| 5 )]');
      });

      it('continues inline box in new group after sticky box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'sticky'},
          {id: 3, type: 'probe', position: 'inline'},
          {id: 4, type: 'probe', position: 'sticky'},
          {id: 5, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 |][( 2 )| 3 |][( 4 )| 5 )]');
      });

      it('does not continue inline box after being interrupted by full box', () => {
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

        expect(container.textContent).toEqual('[( 1 2 )][( 3 )][( 4 )]');
      });

      it('does not continue inline box after being interrupted by wide box', () => {
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

        expect(container.textContent).toEqual('[( 1 2 )][( 3 )][( 4 )]');
      });

      it('does not continue inline box after being interrupted by sticky and full box', () => {
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

        expect(container.textContent).toEqual('[( 1 )][( 2 )][( 3 )][( 4 )]');
      });

      it('does not continue inline box after being interrupted by full and sticky box', () => {
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

        expect(container.textContent).toEqual('[( 1 )][( 2 )][( 3 )( 4 )]');
      });

      it('does not continue inline box after being interrupted by custom margin box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probeWithCustomMargin', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 )( 2 )( 3 )]');
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

        expect(container.textContent).toEqual('[( 1 2 3 )]');
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

      it('renders inline items separated by custom margin item without open end/open start', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probeWithCustomMargin', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 )( 2 )( 3 )');
      });

      it('passes customMargin prop to box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probeWithCustomMargin', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline'}
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, {customMargin}) =>
              <div>{customMargin ? 'custom' : 'normal'} {children}</div>
            }
          </Layout>
        );

        expect(container.textContent).toEqual('normal 1 custom 2 normal 3 ');
      });

      describe('customMargin prop passed to content element', () => {
        it('is true if rendered inline with custom margin', () => {
          const items = [
            {id: 1, type: 'probeWithCustomMarginProp'}
          ];
          const {container} = render(
            <Layout sectionProps={{layout: 'center'}} items={items}>
              {children => children}
            </Layout>
          );

          expect(container.textContent).toEqual('custom 1 ');
        });

        it('is true if rendered wide with custom margin', () => {
          const items = [
            {id: 1, type: 'probeWithCustomMarginProp', position: 'wide'}
          ];
          const {container} = render(
            <Layout sectionProps={{layout: 'center'}} items={items}>
              {children => children}
            </Layout>
          );

          expect(container.textContent).toEqual('custom 1 ');
        });

        it('is false if rendered custom margin is not supported by position', () => {
          const items = [
            {id: 1, type: 'probeWithCustomMarginProp', position: 'left'}
          ];
          const {container} = render(
            <Layout sectionProps={{layout: 'center'}} items={items}>
              {children => children}
            </Layout>
          );

          expect(container.textContent).toEqual('normal 1 ');
        });
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
