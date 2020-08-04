import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';

import {MotifArea} from 'frontend/MotifArea';

describe('MotifArea', () => {
  it('positions element over image file motif area', () => {
    const {container} =
      renderInEntry(
        <MotifArea imageId={100}
                   containerWidth={2000}
                   containerHeight={1000}/>,
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

  it('renders nothing when image is not set', () => {
    const {container} =
      renderInEntry(
        <MotifArea imageId={null}
                   containerWidth={2000}
                   containerHeight={1000}/>
      );

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when image is not ready', () => {
    const {container} =
      renderInEntry(
        <MotifArea imageId={100}
                   containerWidth={2000}
                   containerHeight={1000 }/>,
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
        <MotifArea imageId={100}
                   containerWidth={2000}
                   containerHeight={1000}/>,
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

    const requiredProps = {
      imageId: 100,
      containerWidth: 2000,
      containerHeight: 1000
    };

    it('is called with element on render', () => {
      const callback = jest.fn();
      const {container} =
        renderInEntry(
          <MotifArea {...requiredProps} onUpdate={callback} />,
          {seed}
        );

      expect(callback).toHaveBeenCalledWith(container.firstChild);
    });

    it('is not called when rerendering without changing position', () => {
      const callback = jest.fn();
      const {rerender} =
        renderInEntry(
          <MotifArea {...requiredProps} onUpdate={callback} />,
          {seed}
        );

      rerender(
        <MotifArea {...requiredProps} onUpdate={callback} />,
        {seed}
      );

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('is called when position changes', () => {
      const callback = jest.fn();
      const {container, rerender} =
        renderInEntry(
          <MotifArea {...requiredProps} imageId={100} onUpdate={callback} />,
          {seed}
        );

      callback.mockReset();
      rerender(
        <MotifArea {...requiredProps} imageId={101} onUpdate={callback} />,
        {seed}
      );

      expect(callback).toHaveBeenCalledWith(container.firstChild);
    });

    it('is not called when image is not set', () => {
      const callback = jest.fn();
      renderInEntry(
        <MotifArea {...requiredProps} imageId={null} onUpdate={callback} />,
        {seed}
      );

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
