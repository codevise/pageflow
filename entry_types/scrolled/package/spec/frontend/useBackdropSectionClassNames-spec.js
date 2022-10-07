import React from 'react';

import {useBackdropSectionClassNames} from 'frontend/useBackdropSectionClassNames';
import {useBackdropFile} from 'frontend/useBackdrop';
import {FullscreenDimensionProvider} from 'frontend/Fullscreen';

import {renderHookInEntry} from 'support';

import styles from 'frontend/useBackdropSectionClassNames.module.css';

describe('useBackdropSectionClassNames', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    global.pageflowScrolledSSRAspectRatioMediaQueries = false;
  });

  it('returns section, orientation and left layout class by default', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: null
      })
    );

    expect(result.current).toEqual([
      styles.section,
      styles.orientation,
      styles['layout-left']]);
  });

  it('uses other layout class when passed', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: null
      }, {
        layout: 'right'
      })
    );

    expect(result.current).toEqual([
      styles.section,
      styles.orientation,
      styles['layout-right']
    ]);
  });

  it('sets exposeMotifArea class if exposeMotifArea setting is true and not empty', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: null
      }, {
        exposeMotifArea: true,
        empty: false
      })
    );

    expect(result.current).toContain(styles.exposeMotifArea);
  });

  it('includes aspect ratio class name for file', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: useBackdropFile({collectionName: 'imageFiles', permaId: 10})
      }),
      {
        seed: {
          imageFiles: [{id: 100, permaId: 10, width: 400, height: 300}]
        }
      }
    );

    expect(result.current).toContain('aspectRatio1333');
  });

  it('does not include aspect ratio class name if file is not ready', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: useBackdropFile({collectionName: 'imageFiles', permaId: 10})
      }),
      {
        seed: {
          imageFiles: [{permaId: 10, isReady: false, width: 0, height: 0}]
        }
      }
    );

    expect(result.current).not.toContain(/aspectRatio/);
  });

  it('includes aspect ratio class name for mobile file', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: useBackdropFile({collectionName: 'imageFiles', permaId: 10}),
        mobileFile: useBackdropFile({collectionName: 'imageFiles', permaId: 11})
      }),
      {
        seed: {
          imageFiles: [
            {id: 100, permaId: 10, width: 400, height: 300},
            {id: 101, permaId: 11, width: 300, height: 400}
          ]
        }
      }
    );

    expect(result.current).toContain('aspectRatio1333');
    expect(result.current).toContain('aspectRatioMobile750');
  });

  it('appends style tag with media query for aspect ratio class to head  ', () => {
    renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: useBackdropFile({collectionName: 'imageFiles', permaId: 10})
      }),
      {
        seed: {
          imageFiles: [{id: 100, permaId: 10, width: 400, height: 300}]
        }
      }
    );

    expect(document.head).toHaveStyleTagIncluding(
      '@media (min-aspect-ratio: 1333/1000) {',
      'aspectRatio1333 {'
    );
  });

  it('appends style tag with media query for mobile aspect ratio class', () => {
    renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: useBackdropFile({collectionName: 'imageFiles', permaId: 10}),
        mobileFile: useBackdropFile({collectionName: 'imageFiles', permaId: 11})
      }),
      {
        seed: {
          imageFiles: [
            {id: 100, permaId: 10, width: 400, height: 300},
            {id: 101, permaId: 11, width: 300, height: 400}
          ]
        }
      }
    );

    expect(document.head).toHaveStyleTagIncluding(
      '@media (orientation: portrait) and (min-aspect-ratio: 750/1000) {',
      'aspectRatioMobile750 {'
    );
  });

  it('does not append duplicate style tags', () => {
    renderHookInEntry(
      () => {
        useBackdropSectionClassNames({
          file: useBackdropFile({collectionName: 'imageFiles', permaId: 10})
        });
        useBackdropSectionClassNames({
          file: useBackdropFile({collectionName: 'imageFiles', permaId: 10})
        });
      },
      {
        seed: {
          imageFiles: [{id: 100, permaId: 10, width: 400, height: 300}]
        }
      }
    );

    expect(document.head.querySelectorAll('style').length).toEqual(1);
  });

  it('does not append style tag if file is blank', () => {
    renderHookInEntry(
      () => {
        useBackdropSectionClassNames({
          file: null
        });
      }
    );

    expect(document.head.querySelectorAll('style').length).toEqual(0);
  });

  it('does not append style tag to head if media queries are generated in SSR', () => {
    global.pageflowScrolledSSRAspectRatioMediaQueries = true;

    renderHookInEntry(
      () => useBackdropSectionClassNames({
        file: useBackdropFile({collectionName: 'imageFiles', permaId: 10})
      }),
      {
        seed: {
          imageFiles: [{id: 100, permaId: 10, width: 400, height: 300}]
        }
      }
    );

    expect(document.head.querySelectorAll('style').length).toEqual(0);
  });

  describe('when wrapped in FullscreenDimensionProvider', () => {
    describe('with fullscreen aspect ratio > backdrop aspect ratio', () => {
      it('includes media-query-independant aspect ratio class name', () => {
        const {result} = renderHookInEntry(
          () => useBackdropSectionClassNames({
            file: useBackdropFile({collectionName: 'imageFiles', permaId: 10})
          }),
          {
            wrapper: ({children}) =>
              <FullscreenDimensionProvider width={1600} height={900}>
                {children}
              </FullscreenDimensionProvider>,
            seed: {
              imageFiles: [{id: 100, permaId: 10, width: 400, height: 300}]
            }
          }
        );

        expect(result.current).not.toContain(/aspectRatio/);
        expect(result.current).toContain('minAspectRatio');
      });
    });

    describe('with fullscreen aspect ratio < backdrop aspect ratio', () => {
      it('includes no aspect ratio class name', () => {
        const {result} = renderHookInEntry(
          () => useBackdropSectionClassNames({
            file: useBackdropFile({collectionName: 'imageFiles', permaId: 10})
          }),
          {
            wrapper: ({children}) =>
              <FullscreenDimensionProvider width={300} height={400}>
                {children}
              </FullscreenDimensionProvider>,
            seed: {
              imageFiles: [{id: 100, permaId: 10, width: 400, height: 300}]
            }
          }
        );

        expect(result.current).not.toContain(/aspectRatio/);
      });
    });

    describe('with fullscreen aspect ratio > mobile backdrop aspect ratio', () => {
      it('include aspect ratio class name if fullscreen is portrait', () => {
        const {result} = renderHookInEntry(
          () => useBackdropSectionClassNames({
            file: useBackdropFile({collectionName: 'imageFiles', permaId: 10}),
            mobileFile: useBackdropFile({collectionName: 'imageFiles', permaId: 11})
          }),
          {
            wrapper: ({children}) =>
              <FullscreenDimensionProvider width={201} height={400}>
                {children}
              </FullscreenDimensionProvider>,
            seed: {
              imageFiles: [{id: 100, permaId: 10, width: 400, height: 300},
                           {id: 101, permaId: 11, width: 200, height: 400}]
            }
          }
        );

        expect(result.current).not.toContain(/aspectRatio/);
        expect(result.current).toContain('minAspectRatio');
      });

      it('does not include aspect ratio class name if fullscreen is landscape', () => {
        const {result} = renderHookInEntry(
          () => useBackdropSectionClassNames({
            file: useBackdropFile({collectionName: 'imageFiles', permaId: 10}),
            mobileFile: useBackdropFile({collectionName: 'imageFiles', permaId: 11})
          }),
          {
            wrapper: ({children}) =>
              <FullscreenDimensionProvider width={390} height={300}>
                {children}
              </FullscreenDimensionProvider>,
            seed: {
              imageFiles: [{id: 100, permaId: 10, width: 400, height: 300},
                           {id: 101, permaId: 11, width: 200, height: 400}]
            }
          }
        );

        expect(result.current).not.toContain(/aspectRatio/);
        expect(result.current).not.toContain('minAspectRatio');
      });
    });

    it('does not include orientation class', () => {
      const {result} = renderHookInEntry(
        () => useBackdropSectionClassNames({
          file: null
        }),
        {
          wrapper: ({children}) =>
            <FullscreenDimensionProvider width={500} height={300}>
              {children}
            </FullscreenDimensionProvider>,
        }
      );

      expect(result.current).not.toContain(styles.orientation);
    });

    it('appends style tag with media-query-independant aspect ratio class', () => {
      renderHookInEntry(
        () => useBackdropSectionClassNames({
          file: useBackdropFile({collectionName: 'imageFiles', permaId: 10})
        }),
        {
          wrapper: ({children}) =>
            <FullscreenDimensionProvider width={500} height={300}>
              {children}
            </FullscreenDimensionProvider>,
          seed: {
            imageFiles: [
              {id: 100, permaId: 10, width: 400, height: 300},
            ]
          }
        }
      );

      expect(document.head).toHaveStyleTagIncluding(
        '.minAspectRatio {'
      );
    });
  });
});

expect.extend({
  toHaveStyleTagIncluding(received, ...fragments) {
    const styleElements = [...received.querySelectorAll('style')];
    const styleElement = styleElements.find(el =>
      fragments.every(fragment => el.innerHTML.includes(fragment))
    );

    return styleElement
      ? {
        pass: true,

        message() {
          return `Expected ${received} not to have matching style tag, ` +
                 `but found:\n${styleElement.innerHTML}`;
        }
      } : {
        pass: false,

        message() {
          return `Expected to find matching style tag in:\n ${received.innerHTML}`;
        }
      };
  }
});
