import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';

import {useFile} from 'entryState';
import {useBackgroundFile} from 'frontend/v2/useBackgroundFile';
import {MotifArea} from 'frontend/v2/MotifArea';
import {MotifAreaVisibilityProvider} from 'frontend/MotifAreaVisibilityProvider';
import styles from 'frontend/MotifArea.module.css';

describe('MotifArea', () => {
  it('positions element based on motif area passed to useBackgroundFile', () => {
    const {container} =
      renderInEntry(
        () => {
          const file = useBackgroundFile({
            file: useFile({collectionName: 'imageFiles', permaId: 100}),
            motifArea: {top: 10, left: 20, width: 50, height: 60}
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

    expect(container.firstChild).toHaveStyle('top: 10%');
    expect(container.firstChild).toHaveStyle('left: 20%');
    expect(container.firstChild).toHaveStyle('width: 50%');
    expect(container.firstChild).toHaveStyle('height: 60%');
  });

  it('calls onUpdate callback with DOM element', () => {
    const callback = jest.fn();
    const {container} =
      renderInEntry(
        () => {
          const file = useBackgroundFile({
            file: useFile({collectionName: 'imageFiles', permaId: 100}),
            motifArea: {top: 10, left: 20, width: 50, height: 60}
          });

          return (
            <MotifArea file={file} onUpdate={callback} />
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

    expect(callback).toHaveBeenCalledWith(container.firstChild);
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

  it('makes motif area visible if rendered inside MotifAreaVisibilityProvider', () => {
    const {container} =
      renderInEntry(
        () => {
          const file = useBackgroundFile({
            file: useFile({collectionName: 'imageFiles', permaId: 100}),
            motifArea: {top: 10, left: 10, width: 50, height: 50}
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
