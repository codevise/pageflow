import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';

import {useFile} from 'entryState';
import {useBackgroundFile} from 'frontend/useBackgroundFile';
import {MotifArea, MotifAreaVisibilityProvider} from 'frontend/MotifArea';
import styles from 'frontend/MotifArea.module.css';

describe('MotifArea', () => {
  it('positions element based on motif area passed to useBackgroundFile', () => {
    const {container} =
      renderInEntry(
        () => {
          const file = useBackgroundFile({
            file: useFile({collectionName: 'imageFiles', permaId: 100}),
            motifArea: {top: 10, left: 10, width: 50, height: 50},
            containerDimension: {width: 2000, height: 1000}
          });

          return (
            <MotifArea file={file} />
          );
        },
        {
          seed: {
            imageFiles: [
              {
                permaId: 100,
                width: 200,
                height: 100
              }
            ]
          }
        }
      );

    expect(container.firstChild).toHaveStyle('top: 100px');
    expect(container.firstChild).toHaveStyle('left: 200px');
    expect(container.firstChild).toHaveStyle('width: 1000px');
    expect(container.firstChild).toHaveStyle('height: 500px');
  });

  it('falls back to motif area from file configuration', () => {
    const {container} =
      renderInEntry(
        () => {
          const file = useBackgroundFile({
            file: useFile({collectionName: 'imageFiles', permaId: 100}),
            containerDimension: {width: 2000, height: 1000}
          });

          return (
            <MotifArea file={file} />
          )
        },
        {
          seed: {
            imageFiles: [
              {
                permaId: 100,
                width: 200,
                height: 100,
                configuration: {
                  motifArea: {
                    top: 10,
                    left: 10,
                    width: 50,
                    height: 50
                  }
                }
              }
            ]
          }
        }
      );

    expect(container.firstChild).toHaveStyle('top: 100px');
    expect(container.firstChild).toHaveStyle('left: 200px');
    expect(container.firstChild).toHaveStyle('width: 1000px');
    expect(container.firstChild).toHaveStyle('height: 500px');
  });

  it('renders nothing when file is not set', () => {
    const {container} =
      renderInEntry(
        <MotifArea file={null}
                   containerWidth={2000}
                   containerHeight={1000}/>
      );

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when file is not ready', () => {
    const {container} =
      renderInEntry(
        () => <MotifArea file={useFile({collectionName: 'imageFiles', permaId: 100})} />,
        {
          seed: {
            imageFiles: [
              {
                permaId: 100,
                isReady: false
              }
            ]
          }
        }
      );

    expect(container.firstChild).toBeNull();
  });

  it('renders zero size element when image does not have motif area', () => {
    const {container} =
      renderInEntry(
        () => <MotifArea file={useFile({collectionName: 'imageFiles', permaId: 100})} />,
        {
          seed: {
            imageFiles: [
              {
                permaId: 100,
                width: 200,
                height: 100
              }
            ]
          }
        }
      );

    expect(container.firstChild).toHaveStyle('top: 0px');
    expect(container.firstChild).toHaveStyle('left: 0px');
    expect(container.firstChild).toHaveStyle('width: 0px');
    expect(container.firstChild).toHaveStyle('height: 0px');
  });

  describe('onUpdate prop', () => {
    const seed = {
      imageFiles: [
        {
          permaId: 100,
          width: 200,
          height: 100,
          configuration: {
            motifArea: {
              top: 10,
              left: 10,
              width: 50,
              height: 50
            }
          }
        },
        {
          permaId: 101,
          width: 200,
          height: 100,
          configuration: {
            motifArea: {
              top: 20,
              left: 20,
              width: 100,
              height: 100
            }
          }
        }
      ]
    };

    function useBackgroundFileByPermaId(permaId) {
      return useBackgroundFile({
        file: useFile({collectionName: 'imageFiles', permaId}),
        containerDimension: {width: 2000, height: 1000}
      });
    }

    it('is called with element on render', () => {
      const callback = jest.fn();
      const {container} =
        renderInEntry(
          () => <MotifArea file={useBackgroundFileByPermaId(100)} onUpdate={callback} />,
          {seed}
        );

      expect(callback).toHaveBeenCalledWith(container.firstChild);
    });

    it('is not called when rerendering without changing position', () => {
      const callback = jest.fn();
      const {rerender} =
        renderInEntry(
          () => <MotifArea file={useBackgroundFileByPermaId(100)} onUpdate={callback} />,
          {seed}
        );

      rerender(
        () => <MotifArea file={useBackgroundFileByPermaId(100)} onUpdate={callback} />
      );

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('is called when position changes', () => {
      const callback = jest.fn();
      const {container, rerender} =
        renderInEntry(
          () => <MotifArea file={useBackgroundFileByPermaId(100)}
                           onUpdate={callback} />,
          {seed}
        );

      callback.mockReset();
      rerender(
        () => <MotifArea file={useBackgroundFileByPermaId(101)}
                         onUpdate={callback} />
      );

      expect(callback).toHaveBeenCalledWith(container.firstChild);
    });

    it('is not called when image is not set', () => {
      const callback = jest.fn();
      renderInEntry(
        () => <MotifArea file={null} onUpdate={callback} />,
        {seed}
      );

      expect(callback).not.toHaveBeenCalled();
    });
  });

  it('makes motif area visible if rendered inside MotifAreaVisibilityProvider', () => {
    const {container} =
      renderInEntry(
        () => {
          const file = useBackgroundFile({
            file: useFile({collectionName: 'imageFiles', permaId: 100}),
            motifArea: {top: 10, left: 10, width: 50, height: 50},
            containerDimension: {width: 2000, height: 1000}
          });

          return (
            <MotifArea file={file} />
          );
        },
        {
          wrapper: ({children}) => (
            <MotifAreaVisibilityProvider visible={true}>
              {children}
            </MotifAreaVisibilityProvider>
          ),
          seed: {
            imageFiles: [
              {
                permaId: 100,
                width: 200,
                height: 100
              }
            ]
          }
        }
      );

    expect(container.firstChild).toHaveClass(styles.visible);
  });
});
