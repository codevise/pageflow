export const getInitialTransform = jest.fn();
export const getPanZoomStepTransform = jest.fn();

getInitialTransform.restoreMockImplementation = function() {
  this.mockRestore();
  this.mockImplementation(({indicatorPositions = []}) => {
    return {
      x: 0,
      y: 0,
      scale: 1,
      indicators: indicatorPositions.map(() => ({
        x: 0,
        y: 0,
        scale: 1
      }))
    };
  });
}

getPanZoomStepTransform.restoreMockImplementation = function() {
  this.mockRestore();
  this.mockImplementation(({indicatorPositions = []}) => {
    return {
      x: 0,
      y: 0,
      scale: 1,
      indicators: indicatorPositions.map(() => ({
        x: 0,
        y: 0,
        scale: 1
      }))
    };
  });
}

getInitialTransform.restoreMockImplementation();
getPanZoomStepTransform.restoreMockImplementation();
