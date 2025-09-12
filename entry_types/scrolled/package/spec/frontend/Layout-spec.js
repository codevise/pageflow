import React from 'react';

import {Layout} from 'frontend/layouts';
import {TwoColumn} from 'frontend/layouts/TwoColumn';
import {frontend} from 'pageflow-scrolled/frontend';

import centerStyles from 'frontend/layouts/Center.module.css';
import twoColumnStyles from 'frontend/layouts/TwoColumn.module.css';

import {widthName} from 'frontend/layouts/widths';

import {renderInEntry} from 'testHelpers';

describe('Layout', () => {
  describe('placeholder', () => {
    it('renders in two column variant', () => {
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'left'}}
                items={[]}
                placeholder={<div data-testid="placeholder" />} />
      );

      expect(getByTestId('placeholder')).not.toBeNull();
    });

    it('renders placeholder in center variant', () => {
      const {getByTestId} = renderInEntry(
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

      frontend.contentElementTypes.register('probeWithCustomMarginFunction', {
        customMargin({configuration}) { return configuration.useCustomMargin; },

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
      TwoColumn.GroupComponent = function({children, ...props}) {
        return (
          <div {...props}>[{children}]</div>
        );
      }

      it('is called for each sequence of consecutive items with same position and width', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline', width: 2},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline'},
          {id: 4, type: 'probe', position: 'inline'},
          {id: 5, type: 'probe', position: 'sticky'},
          {id: 6, type: 'probe', position: 'sticky'},
          {id: 7, type: 'probe', position: 'inline'},
          {id: 8, type: 'probe', position: 'inline', width: 3},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, width}) => <div>{position} {widthName(width)} {children}</div>}
          </Layout>
        );

        expect(container.textContent).toEqual(
          '[inline xl 1 ][inline md 2 3 4 ][sticky md 5 6 inline md 7 ][inline full 8 ]'
        );
      });

      it('creates new group for side elements', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'side'},
          {id: 3, type: 'probe', position: 'side'},
          {id: 4, type: 'probe', position: 'inline'}
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position}) => <div>{position} {children}</div>}
          </Layout>
        );

        expect(container.textContent).toEqual(
          '[inline 1 ][side 2 3 inline 4 ]'
        );
      });

      it('places inline elements with custom margin in separate box in same group', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probeWithCustomMargin', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline'}
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, customMargin}) =>
              <div>{position} {customMargin ? 'custom' : 'normal'} {children}</div>
            }
          </Layout>
        );

        expect(container.textContent).toEqual('[inline normal 1 inline custom 2 inline normal 3 ]');
      });

      it('supports function for custom margin option', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probeWithCustomMarginFunction', position: 'inline', props: {useCustomMargin: true}},
          {id: 3, type: 'probeWithCustomMarginFunction', position: 'inline', props: {useCustomMargin: false}}
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, customMargin}) =>
              <div>{position} {customMargin ? 'custom' : 'normal'} {children}</div>
            }
          </Layout>
        );

        expect(container.textContent).toEqual('[inline normal 1 inline custom 2 inline normal 3 ]');
      });

      it('places side elements with and without custom margin in separate groups', () => {
        const items = [
          {id: 1, type: 'probe', position: 'side'},
          {id: 2, type: 'probeWithCustomMargin', position: 'side'}
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, customMargin}) =>
              <div>{position} {customMargin ? 'custom' : 'normal'} {children}</div>
            }
          </Layout>
        );

        expect(container.textContent).toEqual('[side normal 1 ][side custom 2 ]');
      });

      it('places sticky elements with and without custom margin in separate groups', () => {
        const items = [
          {id: 1, type: 'probe', position: 'sticky'},
          {id: 2, type: 'probeWithCustomMargin', position: 'sticky'}
        ];
        const {container} = renderInEntry(
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
          {id: 1, type: 'probe', position: 'inline', width: 3},
          {id: 2, type: 'probeWithCustomMargin', position: 'inline', width: 3}
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, customMargin}) =>
              <div>{customMargin ? 'custom' : 'normal'} {children}</div>
            }
          </Layout>
        );

        expect(container.textContent).toEqual('[normal 1 2 ]');
      });

      describe('customMargin prop passed to content element', () => {
        it('is true if rendered with custom margin', () => {
          const items = [
            {id: 1, type: 'probeWithCustomMarginProp', position: 'inline'}
          ];
          const {container} = renderInEntry(
            <Layout sectionProps={{layout: 'left'}} items={items}>
              {children => children}
            </Layout>
          );

          expect(container.textContent).toEqual('[custom 1 ]');
        });

        it('is false if rendered custom margin is not supported by width', () => {
          const items = [
            {id: 1, type: 'probeWithCustomMarginProp', position: 'inline', width: 3}
          ];
          const {container} = renderInEntry(
            <Layout sectionProps={{layout: 'left'}} items={items}>
              {children => children}
            </Layout>
          );

          expect(container.textContent).toEqual('[normal 1 ]');
        });
      });

      it('continues inline box after being interrupted by side box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'side'},
          {id: 4, type: 'probe', position: 'side'},
          {id: 5, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 2 |][( 3 4 )| 5 )]');
      });

      it('continues inline box after being interrupted by sticky box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'sticky'},
          {id: 4, type: 'probe', position: 'sticky'},
          {id: 5, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 2 |][( 3 4 )| 5 )]');
      });

      it('continues inline box after being interrupted by lg sticky box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'sticky', width: 1},
          {id: 4, type: 'probe', position: 'sticky', width: 1},
          {id: 5, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 2 |][( 3 4 )| 5 )]');
      });

      it('continues inline box in new group after side box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'side'},
          {id: 3, type: 'probe', position: 'inline'},
          {id: 4, type: 'probe', position: 'side'},
          {id: 5, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 |][( 2 )| 3 |][( 4 )| 5 )]');
      });

      it('continues inline box in new group after sticky box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'sticky'},
          {id: 3, type: 'probe', position: 'inline'},
          {id: 4, type: 'probe', position: 'sticky'},
          {id: 5, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 |][( 2 )| 3 |][( 4 )| 5 )]');
      });

      it('does not continue inline box after being interrupted by lg box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline', width: 1},
          {id: 4, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 2 )][( 3 )][( 4 )]');
      });

      it('does not continue inline box after being interrupted by xl box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline', width: 3},
          {id: 4, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 2 )][( 3 )][( 4 )]');
      });

      it('does not continue inline box after being interrupted by side and full box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'side'},
          {id: 3, type: 'probe', position: 'inline', width: 3},
          {id: 4, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 )][( 2 )][( 3 )][( 4 )]');
      });

      it('does not continue inline box after being interrupted by sticky and full box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'sticky'},
          {id: 3, type: 'probe', position: 'inline', width: 3},
          {id: 4, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 )][( 2 )][( 3 )][( 4 )]');
      });

      it('does not continue inline box after being interrupted by full and side box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline', width: 3},
          {id: 3, type: 'probe', position: 'side'},
          {id: 4, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 )][( 2 )][( 3 )( 4 )]');
      });

      it('does not continue inline box after being interrupted by full and sticky box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline', width: 3},
          {id: 3, type: 'probe', position: 'sticky'},
          {id: 4, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
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
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 )( 2 )( 3 )]');
      });

      it('continues inline box after being interrupted by side custom margin box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probeWithCustomMargin', position: 'side'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 |][( 2 )| 3 )]');
      });

      it('continues inline box after being interrupted by sticky custom margin box', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probeWithCustomMargin', position: 'sticky'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('[( 1 |][( 2 )| 3 )]');
      });

      it('inlines side elements of different width at different breakpoints ', () => {
        const items = [
          {id: 1, type: 'probe', position: 'side'},
          {id: 2, type: 'probe', position: 'side', width: 1},
          {id: 3, type: 'probe', position: 'side', width: 2}
        ];
        window.matchMedia.mockViewportWidth(1000);
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position}) => <div>{position} {children}</div>}
          </Layout>,
          {
            seed: {
              themeOptions: {
                properties: {
                  root: {
                    twoColumnStickyBreakpoint: '950px',
                    twoColumnStickyLgBreakpoint: '1024px',
                    twoColumnStickyXlBreakpoint: '1180px'
                  }
                }
              }
            }
          }
        );

        expect(container.textContent).toEqual(
          '[side 1 inline 2 ][inline 3 ]'
        );
      });

      it('inlines sticky elements of different width at different breakpoints ', () => {
        const items = [
          {id: 1, type: 'probe', position: 'sticky'},
          {id: 2, type: 'probe', position: 'sticky', width: 1},
          {id: 3, type: 'probe', position: 'sticky', width: 2}
        ];
        window.matchMedia.mockViewportWidth(1000);
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position}) => <div>{position} {children}</div>}
          </Layout>,
          {
            seed: {
              themeOptions: {
                properties: {
                  root: {
                    twoColumnStickyBreakpoint: '950px',
                    twoColumnStickyLgBreakpoint: '1024px',
                    twoColumnStickyXlBreakpoint: '1180px'
                  }
                }
              }
            }
          }
        );

        expect(container.textContent).toEqual(
          '[sticky 1 inline 2 ][inline 3 ]'
        );
      });

      it('decreases size when inlining wide side elements', () => {
        const items = [
          {id: 1, type: 'probe', position: 'side', width: -2},
          {id: 2, type: 'probe', position: 'side', width: -1},
          {id: 3, type: 'probe', position: 'side'},
          {id: 4, type: 'probe', position: 'side', width: 1},
          {id: 5, type: 'probe', position: 'side', width: 2}
        ];
        window.matchMedia.mockViewportWidth(500);
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, width}) => <div>{position} {widthName(width)} {children}</div>}
          </Layout>,
          {
            seed: {
              themeOptions: {
                properties: {
                  root: {
                    twoColumnStickyBreakpoint: '950px',
                    twoColumnStickyLgBreakpoint: '1024px',
                    twoColumnStickyXlBreakpoint: '1180px'
                  }
                }
              }
            }
          }
        );

        expect(container.textContent).toEqual(
          '[inline xs 1 ][inline sm 2 ][inline md 3 4 ][inline lg 5 ]'
        );
      });

      it('decreases size when inlining wide sticky elements', () => {
        const items = [
          {id: 1, type: 'probe', position: 'sticky', width: -2},
          {id: 2, type: 'probe', position: 'sticky', width: -1},
          {id: 3, type: 'probe', position: 'sticky'},
          {id: 4, type: 'probe', position: 'sticky', width: 1},
          {id: 5, type: 'probe', position: 'sticky', width: 2}
        ];
        window.matchMedia.mockViewportWidth(500);
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'left'}} items={items}>
            {(children, {position, width}) => <div>{position} {widthName(width)} {children}</div>}
          </Layout>,
          {
            seed: {
              themeOptions: {
                properties: {
                  root: {
                    twoColumnStickyBreakpoint: '950px',
                    twoColumnStickyLgBreakpoint: '1024px',
                    twoColumnStickyXlBreakpoint: '1180px'
                  }
                }
              }
            }
          }
        );

        expect(container.textContent).toEqual(
          '[inline xs 1 ][inline sm 2 ][inline md 3 4 ][inline lg 5 ]'
        );
      });
    });

    describe('in center variant', () => {
      it('calls children for each item passing position and width', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline', width: 2},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'left'},
          {id: 4, type: 'probe', position: 'inline', width: 3},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, {position, width}) => <div>{position} {widthName(width)} {children}</div>}
          </Layout>
        );

        expect(container.textContent).toEqual('inline xl 1 inline md 2 left md 3 inline full 4 ');
      });

      it('renders consecutive inline items with open end/open start', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline'},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
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
        const {container} = renderInEntry(
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
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 || 2 || 3 )');
      });

      it('renders items separated by full width item without open end/open start', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline', width: 3},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, boxProps) => <Box {...boxProps}>{children}</Box>}
          </Layout>
        );

        expect(container.textContent).toEqual('( 1 )( 2 )( 3 )');
      });

      it('renders items separated by wide item without open end/open start', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probe', position: 'inline', width: 1},
          {id: 3, type: 'probe', position: 'inline'},
        ];
        const {container} = renderInEntry(
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
        const {container} = renderInEntry(
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
        const {container} = renderInEntry(
          <Layout sectionProps={{layout: 'center'}} items={items}>
            {(children, {customMargin}) =>
              <div>{customMargin ? 'custom' : 'normal'} {children}</div>
            }
          </Layout>
        );

        expect(container.textContent).toEqual('normal 1 custom 2 normal 3 ');
      });

      it('supports function for custom margin option', () => {
        const items = [
          {id: 1, type: 'probe', position: 'inline'},
          {id: 2, type: 'probeWithCustomMarginFunction', position: 'inline', props: {useCustomMargin: true}},
          {id: 3, type: 'probeWithCustomMarginFunction', position: 'inline', props: {useCustomMargin: false}}
        ];
        const {container} = renderInEntry(
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
            {id: 1, type: 'probeWithCustomMarginProp', position: 'inline'}
          ];
          const {container} = renderInEntry(
            <Layout sectionProps={{layout: 'center'}} items={items}>
              {children => children}
            </Layout>
          );

          expect(container.textContent).toEqual('custom 1 ');
        });

        it('is true if rendered with xl width with custom margin', () => {
          const items = [
            {id: 1, type: 'probeWithCustomMarginProp', position: 'inline', width: 2}
          ];
          const {container} = renderInEntry(
            <Layout sectionProps={{layout: 'center'}} items={items}>
              {children => children}
            </Layout>
          );

          expect(container.textContent).toEqual('custom 1 ');
        });

        it('is false if rendered with floated position', () => {
          const items = [
            {id: 1, type: 'probeWithCustomMarginProp', position: 'left'}
          ];
          const {container} = renderInEntry(
            <Layout sectionProps={{layout: 'center'}} items={items}>
              {children => children}
            </Layout>
          );

          expect(container.textContent).toEqual('normal 1 ');
        });

        it('is false if rendered with full width with custom margin', () => {
          const items = [
            {id: 1, type: 'probeWithCustomMarginProp', position: 'inline', width: 3}
          ];
          const {container} = renderInEntry(
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
        const {container} = renderInEntry(
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
      const {getByTestId} = renderInEntry(
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
      const {getByTestId} = renderInEntry(
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
      const {getByTestId} = renderInEntry(
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
      const {getByTestId} = renderInEntry(
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
      const {getByTestId} = renderInEntry(
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
      const {getByTestId} = renderInEntry(
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
      const {getByTestId} = renderInEntry(
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
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('wrappingProbe'), centerStyles.clear)).toBeNull();
    });

    it('sets sideBySide class on side-by-side floats', () => {
      const items = [
        {id: 1, type: 'probe', position: 'left', props: {testId: 'left'}},
        {id: 2, type: 'probe', position: 'right', props: {testId: 'right'}}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('left'), centerStyles.sideBySide)).not.toBeNull();
      expect(findParentWithClass(getByTestId('right'), centerStyles.sideBySide)).not.toBeNull();
    });

    it('does not set sideBySide class on consecutive float on the same side', () => {
      const items = [
        {id: 1, type: 'probe', position: 'left', props: {testId: 'first'}},
        {id: 2, type: 'probe', position: 'left', props: {testId: 'second'}}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('first'), centerStyles.sideBySide)).toBeNull();
      expect(findParentWithClass(getByTestId('second'), centerStyles.sideBySide)).toBeNull();
    });

    it('does not set sideBySide class on floats separated by text', () => {
      const items = [
        {id: 1, type: 'probe', position: 'left', props: {testId: 'left'}},
        {id: 2, type: 'wrappingProbe', position: 'inline'},
        {id: 3, type: 'probe', position: 'right', props: {testId: 'right'}}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('left'), centerStyles.sideBySide)).toBeNull();
      expect(findParentWithClass(getByTestId('right'), centerStyles.sideBySide)).toBeNull();
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
      const {container} = renderInEntry(
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
      const {container} = renderInEntry(
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
      const {container} = renderInEntry(
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
      const {container} = renderInEntry(
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
        {id: 2, type: 'probe', position: 'inline'},
      ];
      const {container} = renderInEntry(
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
        {id: 2, type: 'probe', position: 'inline'},
      ];
      const {container} = renderInEntry(
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
        {id: 4, type: 'wrappingProbe', position: 'inline'},
      ];
      const {container} = renderInEntry(
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
        {id: 4, type: 'wrappingProbe', position: 'inline'},
      ];
      const {container} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {(children, {selfClear}) =>
            <div>{selfClear} {children}</div>
          }
        </Layout>
      );

      expect(container.textContent).toEqual('left right both both ');
    });
  });

  describe('width classes in two-column variant', () => {
    beforeAll(() => {
      frontend.contentElementTypes.register('probe', {
        component: function Probe({configuration}) {
          return <div data-testid="probe"/>;
        }
      });
    });

    it('applies width class to inline items', () => {
      const items = [
        {id: 2, type: 'probe', position: 'inline', width: 1}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'left'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), twoColumnStyles['width-lg'])).not.toBeNull();
    });

    it('applies full class to inline group with width 3', () => {
      const items = [
        {id: 2, type: 'probe', position: 'inline', width: 3}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'left'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), twoColumnStyles['group-full'])).not.toBeNull();
    });

    it('applies restrict classes to inline box with negative width', () => {
      const items = [
        {id: 2, type: 'probe', position: 'inline', width: -2}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'left'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), twoColumnStyles['restrict-xs'])).not.toBeNull();
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
        {id: 2, type: 'probe', position: 'inline', width: 1}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['item-inline-lg'])).not.toBeNull();
    });

    it('does not appliy width class to floated items', () => {
      const items = [
        {id: 2, type: 'probe', position: 'left', width: 2}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['item-inline-xl'])).toBeNull();
    });

    it('applies width class to inner of inline item', () => {
      const items = [
        {id: 2, type: 'probe', position: 'inline', width: -3}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['inner-xxs'])).not.toBeNull();
    });

    it('applies width class to inner of floated item', () => {
      const items = [
        {id: 2, type: 'probe', position: 'inline', width: 2}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['inner-xl'])).not.toBeNull();
    });

    it('applies width class to outer of full width item', () => {
      const items = [
        {id: 2, type: 'probe', position: 'inline', width: 3}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['outer-full'])).not.toBeNull();
    });
  });

  describe('alignment classes in two column variant', () => {
    it('applies alignment class to inline box with negative width', () => {
      const items = [
        {id: 2, type: 'probe', position: 'inline', width: -2, alignment: 'left'}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'left'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), twoColumnStyles['align-left'])).not.toBeNull();
    });

    it('does not apply alignment class to sticky elements with negative width', () => {
      const items = [
        {id: 2, type: 'probe', position: 'sticky', width: -2, alignment: 'left'}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'left'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), twoColumnStyles['align-left'])).toBeNull();
    });

    it('does not apply alignment class to inlined sticky elements with negative width', () => {
      const items = [
        {id: 2, type: 'probe', position: 'sticky', width: -2, alignment: 'left'}
      ];
      window.matchMedia.mockViewportWidth(500);
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'left'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), twoColumnStyles['align-left'])).toBeNull();
    });

    it('does not apply alignment class to inline box with non-negative width', () => {
      const items = [
        {id: 2, type: 'probe', position: 'inline', alignment: 'left'}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'left'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), twoColumnStyles['align-left'])).toBeNull();
    });
  });

  describe('alignment classes in centered variant', () => {
    it('applies alignment class to inline item', () => {
      const items = [
        {id: 2, type: 'probe', position: 'inline', width: -2, alignment: 'right'}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['align-right'])).not.toBeNull();
    });

    it('does not apply alignment class to floated elements', () => {
      const items = [
        {id: 2, type: 'probe', position: 'left', width: -2, alignment: 'right'}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), centerStyles['align-right'])).toBeNull();
    });

    it('does not apply alignment class to elements with non-negative width', () => {
      const items = [
        {id: 2, type: 'probe', position: 'inline', alignment: 'right'}
      ];
      const {getByTestId} = renderInEntry(
        <Layout sectionProps={{layout: 'center'}} items={items}>
          {children => children}
        </Layout>
      );

      expect(findParentWithClass(getByTestId('probe'), twoColumnStyles['align-right'])).toBeNull();
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
