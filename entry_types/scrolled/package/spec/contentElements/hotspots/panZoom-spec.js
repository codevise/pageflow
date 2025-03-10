import {getPanZoomStepTransform} from 'contentElements/hotspots/panZoom';

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
      scale: 1,
      x: -300,
      y: 0
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
      scale: 2.5,
      x: -500,
      y: 0
    });
  });
});
