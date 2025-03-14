import {
  getInitialTransform,
  getPanZoomStepTransform
} from 'contentElements/hotspots/panZoom';

import {panZoomExamples} from './panZoomExamples';

describe('getInitialTransform', () => {
  panZoomExamples.forEach(example => {
    it(`matches snapshot for ${example.name}`, () => {
      const result = getInitialTransform({
        containerWidth: example.container.width,
        containerHeight: example.container.height,
        imageFileWidth: example.imageFile.width,
        imageFileHeight: example.imageFile.height,
        areasBoundingRect: example.areasBoundingRect,
        indicatorPositions: [example.indicatorPosition]
      });

      expect(result).toMatchSnapshot();
    });
  });
});


describe('getPanZoomStepTransform', () => {
  it('covers container such that area is centered', () => {
    const result = getPanZoomStepTransform({
      areaOutline: [[30, 20], [50, 20], [50, 100], [30, 100]],
      areaZoom: 0,
      containerWidth: 1000,
      containerHeight: 1000,
      imageFileWidth: 4000,
      imageFileHeight: 2000
    });

    expect(result).toMatchObject({
      wrapper: {
        scale: 1,
        x: -300,
        y: 0
      }
    });
  });

  it('supports zooming to fit area in container', () => {
    const result = getPanZoomStepTransform({
      areaOutline: [[10, 10], [30, 10], [30, 30], [10, 30]],
      areaZoom: 100,
      containerWidth: 1000,
      containerHeight: 1000,
      imageFileWidth: 4000,
      imageFileHeight: 2000
    });

    expect(result).toMatchObject({
      wrapper: {
        scale: 2.5,
        x: -500,
        y: 0
      }
    });
  });

  panZoomExamples.forEach(example => {
    it(`matches snapshot for ${example.name}`, () => {
      const result = getPanZoomStepTransform({
        containerWidth: example.container.width,
        containerHeight: example.container.height,
        imageFileWidth: example.imageFile.width,
        imageFileHeight: example.imageFile.height,
        areaOutline: example.area.outline,
        areaZoom: example.area.zoom,
        indicatorPositions: [example.indicatorPosition]
      });

      expect(result).toMatchSnapshot();
    });
  });
});
