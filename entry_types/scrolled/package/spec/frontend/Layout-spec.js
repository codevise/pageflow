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

      it('places sticky elements with and without custom margin in separate groups', () => {
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

        expect(container.textContent).toEqual('[sticky normal 1 ][sticky custom 2 ]');
      });

      it('does not apply custom margins for full elements', () => {
        const items = [
          {id: 1, type: 'probe', position: 'full'},
          {id: 2, type: 'probeWithCustomMargin', position: 'full'}
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, customMargin}) =>
              <div>{position} {customMargin ? 'custom' : 'normal'} {children}</div>
            }
          </Layout>
        );

        expect(container.textContent).toEqual('[full normal 1 2 ]');
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
            {id: 1, type: 'probeWithCustomMarginProp', position: 'full'}
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

      it('continues inline box after being interrupted by sticky custom margin box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probeWithCustomMargin', position: 'sticky'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = render(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 |][( 2 )| 3 )]');
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
        component: function Probe({configuration}) {
          const testId = configuration?.testId || 'probe';
          return <div data-testid={testId} />;
        }
      });

      frontend.contentElementTypes.register('wrappingProbe', {
        supportsWrappingAroundFloats: true,

        component: function WrappingProbe() {
          return <div data-testid="wrappingProbe" />;
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

      expect(findParentWithClass(getByTestId('wrappingProbe'), centerStyles.clear)).toBeNull();
    });

    it('does not clear right item after left item to allow-side-by-side', () => {
      const items = [
        {id: 1, type: 'probe', position: 'left'},
        {id: 2, type: 'probe', position: 'right', props: {testId: 'right'}},
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('right'), centerStyles.clear)).toBeNull();
    });

    it('does not clear left item after right item to allow-side-by-side', () => {
      const items = [
        {id: 1, type: 'probe', position: 'right'},
        {id: 2, type: 'probe', position: 'left', props: {testId: 'left'}},
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('left'), centerStyles.clear)).toBeNull();
    });

    it('clears left item after left item to horizontal horizonal stacking of items on same side', () => {
      const items = [
        {id: 1, type: 'probe', position: 'right'},
        {id: 2, type: 'probe', position: 'right', props: {testId: 'right-2'}},
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('right-2'), centerStyles.clear)).not.toBeNull();
    });

    it('clears floated item after inline item', () => {
      const items = [
        {id: 1, type: 'probe', position: 'inline'},
        {id: 2, type: 'probe', position: 'left', props: {testId: 'left'}},
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('left'), centerStyles.clear)).not.toBeNull();
    });

    it('clears item that supports wrapping around floats after side-by-side floats', () => {
      const items = [
        {id: 1, type: 'probe', position: 'left'},
        {id: 2, type: 'probe', position: 'right'},
        {id: 3, type: 'wrappingProbe', position: 'inline'},
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('wrappingProbe'), centerStyles.clear)).not.toBeNull();
    });

    it('does not clear item that supports wrapping after mutliple floats on same side', () => {
      const items = [
        {id: 1, type: 'probe', position: 'right'},
        {id: 2, type: 'probe', position: 'right'},
        {id: 3, type: 'wrappingProbe', position: 'inline'},
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('wrappingProbe'), centerStyles.clear)).toBeNull();
    });
  });

  describe('self clearing prop passed to box in centered layout', () => {
    beforeAll(() => {
      frontend.contentElementTypes.register('probe', {
        component: function Probe({configuration}) {
          return <div />;
        }
      });

      frontend.contentElementTypes.register('wrappingProbe', {
        supportsWrappingAroundFloats: true,

        component: function WrappingProbe() {
          return <div />;
        }
      });
    });

    it('self clears wrapping elements after left', () => {
      const items = [
        {id: 1, type: 'probe', position: 'left'},
        {id: 2, type: 'wrappingProbe', position: 'inline'},
      ];
      const {container} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {(children, {selfClear}) =>
            <div>{selfClear} {children}</div>
          }
        </Layout>
      );

      expect(container.textContent).toEqual('right both ');
    });

    it('self clears wrapping elements after right', () => {
      const items = [
        {id: 1, type: 'probe', position: 'right'},
        {id: 2, type: 'wrappingProbe', position: 'inline'},
      ];
      const {container} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {(children, {selfClear}) =>
            <div>{selfClear} {children}</div>
          }
        </Layout>
      );

      expect(container.textContent).toEqual('left both ');
    });

    it('self clears left followed by left', () => {
      const items = [
        {id: 1, type: 'probe', position: 'left'},
        {id: 2, type: 'probe', position: 'left'},
      ];
      const {container} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {(children, {selfClear}) =>
            <div>{selfClear} {children}</div>
          }
        </Layout>
      );

      expect(container.textContent).toEqual('both both ');
    });

    it('self clears right followed by right', () => {
      const items = [
        {id: 1, type: 'probe', position: 'right'},
        {id: 2, type: 'probe', position: 'right'},
      ];
      const {container} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {(children, {selfClear}) =>
            <div>{selfClear} {children}</div>
          }
        </Layout>
      );

      expect(container.textContent).toEqual('both both ');
    });

    it('self clears left before non-wrapping inline', () => {
      const items = [
        {id: 1, type: 'probe', position: 'left'},
        {id: 2, type: 'probe'},
      ];
      const {container} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {(children, {selfClear}) =>
            <div>{selfClear} {children}</div>
          }
        </Layout>
      );

      expect(container.textContent).toEqual('both none ');
    });

    it('self clears right before non-wrapping inline', () => {
      const items = [
        {id: 1, type: 'probe', position: 'right'},
        {id: 2, type: 'probe'},
      ];
      const {container} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {(children, {selfClear}) =>
            <div>{selfClear} {children}</div>
          }
        </Layout>
      );

      expect(container.textContent).toEqual('both none ');
    });

    it('self clears last left on both sides in alternating cluster', () => {
      const items = [
        {id: 1, type: 'probe', position: 'left'},
        {id: 2, type: 'probe', position: 'right'},
        {id: 3, type: 'probe', position: 'left'},
        {id: 4, type: 'wrappingProbe'},
      ];
      const {container} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {(children, {selfClear}) =>
            <div>{selfClear} {children}</div>
          }
        </Layout>
      );

      expect(container.textContent).toEqual('right left both both ');
    });

    it('self clears last right on both sides in alternating cluster', () => {
      const items = [
        {id: 1, type: 'probe', position: 'right'},
        {id: 2, type: 'probe', position: 'left'},
        {id: 3, type: 'probe', position: 'right'},
        {id: 4, type: 'wrappingProbe'},
      ];
      const {container} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {(children, {selfClear}) =>
            <div>{selfClear} {children}</div>
          }
        </Layout>
      );

      expect(container.textContent).toEqual('left right both both ');
    });
  });

  describe('width classes in centered variant', () => {
    beforeAll(() => {
      frontend.contentElementTypes.register('probe', {
        component: function Probe({configuration}) {
          return <div data-testid="probe"/>;
        }
      });
    });

    it('applies width class to inline items', () => {
      const items = [
        {id: 2, type: 'probe', props: {width: 1}}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['item-inline-lg'])).not.toBeNull();
    });

    it('does not appliy width class to floated items', () => {
      const items = [
        {id: 2, type: 'probe', position: 'left', props: {width: 2}}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['item-inline-xl'])).toBeNull();
    });

    it('applies width class to legacy wide items', () => {
      const items = [
        {id: 2, type: 'probe', position: 'wide'}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['item-inline-xl'])).not.toBeNull();
    });

    it('applies width class to legacy full items', () => {
      const items = [
        {id: 2, type: 'probe', position: 'full'}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['item-inline-full'])).not.toBeNull();
    });

    it('applies width class to inner of inline item', () => {
      const items = [
        {id: 2, type: 'probe', props: {width: -3}}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['inner-xxs'])).not.toBeNull();
    });

    it('applies width class to inner of floated item', () => {
      const items = [
        {id: 2, type: 'probe', props: {width: 2}}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['inner-xl'])).not.toBeNull();
    });

    it('changes xxs to xs for floated item', () => {
      const items = [
        {id: 2, type: 'probe', position: 'left', props: {width: -3}}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['inner-xs'])).not.toBeNull();
    });

    it('changes full to xl for floated item', () => {
      const items = [
        {id: 2, type: 'probe', position: 'left', props: {width: 3}}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['inner-xl'])).not.toBeNull();
    });

    it('applies width class to outer of full width item', () => {
      const items = [
        {id: 2, type: 'probe', props: {width: 3}}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['outer-full'])).not.toBeNull();
    });

    it('applies width class to outer of legacy full item', () => {
      const items = [
        {id: 2, type: 'probe', position: 'full'}
      ];
      const {getByTestId} = render(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['outer-full'])).not.toBeNull();
    });
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
