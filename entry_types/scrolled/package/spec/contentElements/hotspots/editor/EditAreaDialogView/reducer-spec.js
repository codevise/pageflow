import {
  reducer,
  drawnOutlinePoints,
  handles,
  SET_MODE,
  DRAG,
  DRAG_HANDLE,
  DRAG_HANDLE_STOP,
  DOUBLE_CLICK_HANDLE,
  MOUSE_MOVE,
  DRAG_POTENTIAL_POINT,
  DRAG_POTENTIAL_POINT_STOP,
  DRAG_INDICATOR
} from 'contentElements/hotspots/editor/EditAreaDialogView/reducer';

const initialState = {
  indicatorPosition: [50, 50]
};

describe('reducer', () => {
  describe('SET_MODE', () => {
    it('sets points to bounding box when switching to rect mode', () => {
      const state = reducer({
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
      }, {type: SET_MODE, value: 'rect'});

      expect(state).toMatchObject({
        mode: 'rect',
        points: [[10, 10], [50, 10], [50, 50], [10, 50]]
      });
    });

    it('keeps points when switching to polygon', () => {
      const state = reducer({
        ...initialState,
        mode: 'rect',
        points: [[10, 10], [50, 10], [50, 50], [10, 50]]
      }, {type: SET_MODE, value: 'polygon'});

      expect(state).toMatchObject({
        mode: 'polygon',
        points: [[10, 10], [50, 10], [50, 50], [10, 50]]
      });
    });

    it('restores points when switching back to polygon', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: SET_MODE, value: 'rect'});
      state = reducer(state, {type: SET_MODE, value: 'polygon'});

      expect(state.points).toEqual(
        [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
      );
    });

    it('does not restore points when setting mode to current mode', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: SET_MODE, value: 'rect'});
      state = reducer(state, {type: SET_MODE, value: 'polygon'});
      state = reducer(state, {type: DRAG_HANDLE, index: 0, cursor: [0, 20]});
      state = reducer(state, {type: SET_MODE, value: 'polygon'});

      expect(state.points).toEqual(
        [[0, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
      );
    });

    it('forgets polygon when resizing rect', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: SET_MODE, value: 'rect'});
      state = reducer(state, {type: DRAG_HANDLE, index: 2, cursor: [60, 10]});
      state = reducer(state, {type: SET_MODE, value: 'polygon'});

      expect(state).toMatchObject({
        mode: 'polygon',
        points: [[10, 10], [60, 10], [60, 50], [10, 50]]
      });
    });
  });

  describe('DRAG', () => {
    it('updates points and indicatorPosition', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]],
        indicatorPosition: [10, 20]
      };
      state = reducer(state, {type: DRAG, delta: [10, 20]});

      expect(state).toMatchObject({
        points: [[20, 40], [30, 40], [60, 30], [60, 70], [20, 70]],
        indicatorPosition: [20, 40]
      });
    });

    it('does not allow moving beyond top/left bounds', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [20, 50]],
        indicatorPosition: [15, 20]
      };
      state = reducer(state, {type: DRAG, delta: [-20, -30]});

      expect(state).toMatchObject({
        points: [[0, 0], [10, 0], [10, 30]],
        indicatorPosition: [5, 0]
      });
    });

    it('does not allow moving beyond bottom/rights bounds', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [20, 50]],
        indicatorPosition: [15, 20]
      };
      state = reducer(state, {type: DRAG, delta: [100, 100]});

      expect(state).toMatchObject({
        points: [[90, 70], [100, 70], [100, 100]],
        indicatorPosition: [95, 70]
      });
    });
  });

  describe('DRAG_HANDLE', () => {
    describe('in polygon mode', () => {
      it('updates points', () => {
        let state = {
          ...initialState,
          mode: 'polygon',
          points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 1, cursor: [30, 25]});

        expect(state.points).toEqual(
          [[10, 20], [30, 25], [50, 10], [50, 50], [10, 50]]
        );
      });

      it('keeps indicator inside area', () => {
        let state = {
          ...initialState,
          mode: 'polygon',
          points: [[10, 20], [20, 20], [50, 10], [50, 50], [15, 50]],
          indicatorPosition: [10, 20]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 0, cursor: [15, 20]});

        expect(state.indicatorPosition).toEqual([15, 20]);
      });

      it('does not move indicator if still inside area', () => {
        let state = {
          ...initialState,
          mode: 'polygon',
          points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]],
          indicatorPosition: [15, 23]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 0, cursor: [15, 20]});

        expect(state.indicatorPosition).toEqual([15, 23]);
      });
    });

    describe('in rect mode', () => {
      it('resizes rect via mid point handle', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 1, cursor: [15, 10]});

        expect(state.points).toEqual(
          [[10, 10], [20, 10], [20, 40], [10, 40]]
        );
      });

      it('resizes rect via corner handle', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 2, cursor: [25, 15]});

        expect(state.points).toEqual(
          [[10, 15], [25, 15], [25, 40], [10, 40]]
        );
      });

      it('allows resizing in two directions one after the other', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 1, cursor: [15, 10]});
        state = reducer(state, {type: DRAG_HANDLE_STOP});
        state = reducer(state, {type: DRAG_HANDLE, index: 5, cursor: [15, 50]});

        expect(state.points).toEqual(
          [[10, 10], [20, 10], [20, 50], [10, 50]]
        );
      });

      it('keeps indicator inside area', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]],
          indicatorPosition: [15, 20]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 0, cursor: [15, 30]});

        expect(state.indicatorPosition).toEqual([15, 30]);
      });

      it('does not move indicator if still inside area', () => {
        let state = {
          ...initialState,
          mode: 'polygon',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]],
          indicatorPosition: [15, 30]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 0, cursor: [15, 25]});

        expect(state.indicatorPosition).toEqual([15, 30]);
      });
    });
  });

  describe('DOUBLE_CLICK_HANDLE', () => {
    it('removes point', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: DOUBLE_CLICK_HANDLE, index: 1});

      expect(state.points).toEqual(
        [[10, 20], [50, 10], [50, 50], [10, 50]]
      );
    });

    it('resets potential point', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]],
        potentialPoint: [15, 20]
      };
      state = reducer(state, {type: DOUBLE_CLICK_HANDLE, index: 1});

      expect(state.potentialPoint).toBeNull();
    });

    it('does not remove point if less than four are left', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10]]
      };
      state = reducer(state, {type: DOUBLE_CLICK_HANDLE, index: 1});

      expect(state.points).toEqual(
        [[10, 20], [20, 20], [50, 10]]
      );
    });

    it('is noop in rect mode', () => {
      const state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 50], [10, 50]]
      };
      const newState = reducer(state, {type: DOUBLE_CLICK_HANDLE, index: 1});

      expect(newState).toBe(state);
    });

    it('keeps indicator inside area', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [20, 30], [10, 30]],
        indicatorPosition: [19, 19]
      };
      state = reducer(state, {type: DOUBLE_CLICK_HANDLE, index: 1});

      expect(state.indicatorPosition).toEqual([14, 24]);
    });
  });

  describe('MOUSE_MOVE', () => {
    it('updates potential point in polygon mode', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: MOUSE_MOVE, cursor: [20, 10]});

      expect(state.potentialPoint).toEqual([15, 15]);
    });

    it('noop in rect mode', () => {
      const state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 10], [20, 10], [20, 20], [10, 20]]
      };
      const newState = reducer(state, {type: MOUSE_MOVE, cursor: [20, 10]});

      expect(newState).toBe(state);
    });
  });

  describe('DRAG_POTENTIAL_POINT', () => {
    it('updats potential point', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: DRAG_POTENTIAL_POINT, cursor: [20, 10]});

      expect(state.potentialPoint).toEqual([20, 10]);
    });

    it('ignores subsequent MOUSE_MOVE actions', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: MOUSE_MOVE, cursor: [20, 10]});
      state = reducer(state, {type: DRAG_POTENTIAL_POINT, cursor: [20, 10]});
      state = reducer(state, {type: MOUSE_MOVE, cursor: [20, 10]});

      expect(state.potentialPoint).toEqual([20, 10]);
    });
  });

  describe('DRAG_POTENTIAL_POINT_STOP', () => {
    it('reset potential point and adds point', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: MOUSE_MOVE, cursor: [20, 10]});
      state = reducer(state, {type: DRAG_POTENTIAL_POINT, cursor: [20, 10]});
      state = reducer(state, {type: DRAG_POTENTIAL_POINT_STOP});

      expect(state).toMatchObject({
        points: [[10, 10], [20, 10], [20, 20], [50, 10], [50, 50], [10, 50]],
        potentialPoint: null
      });
    });

    it('resumes handling MOUSE_MOVE actions', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: MOUSE_MOVE, cursor: [20, 10]});
      state = reducer(state, {type: DRAG_POTENTIAL_POINT, cursor: [20, 10]});
      state = reducer(state, {type: DRAG_POTENTIAL_POINT_STOP, cursor: [20, 10]});
      state = reducer(state, {type: MOUSE_MOVE, cursor: [15, 5]});

      expect(state.potentialPoint).toEqual([15, 10]);
    });
  });

  describe('DRAG_INDICATOR', () => {
    it('updates indicator position', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 10], [20, 50]],
        indicatorPosition: [11, 11]
      };
      state = reducer(state, {type: DRAG_INDICATOR, cursor: [15, 11]});

      expect(state.indicatorPosition).toEqual([15, 11]);
    });

    it('does not allow dragging indicator out of area', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 10], [20, 50]],
        indicatorPosition: [11, 11]
      };
      state = reducer(state, {type: DRAG_INDICATOR, cursor: [5, 5]});

      expect(state.indicatorPosition).toEqual([10, 10]);
    });
  });
});

describe('drawnOutlinePoints', () => {
  it('returns points by default', () => {
    let state = {
      ...initialState,
      mode: 'polygon',
      points: [[10, 10], [20, 20], [50, 50]]
    };
    state = reducer(state, {type: MOUSE_MOVE, cursor: [20, 10]});

    expect(drawnOutlinePoints(state)).toEqual(
      [[10, 10], [20, 20], [50, 50]]
    );
  });

  it('includes potential point while dragging', () => {
    let state = {
      ...initialState,
      mode: 'polygon',
      points: [[10, 10], [20, 20], [50, 50]]
    };
    state = reducer(state, {type: MOUSE_MOVE, cursor: [20, 10]});
    state = reducer(state, {type: DRAG_POTENTIAL_POINT, cursor: [20, 10]});

    expect(drawnOutlinePoints(state)).toEqual(
      [[10, 10], [20, 10], [20, 20], [50, 50]]
    );
  });
});

describe('handles', () => {
  it('maps to points in polygon mode', () => {
    const state = {
      ...initialState,
      mode: 'polygon',
      points: [[10, 10], [20, 20], [50, 50], [30, 50]]
    };

    expect(handles(state)).toEqual(
      [
        {point: [10, 10], deletable: true, cursor: 'move', circle: true},
        {point: [20, 20], deletable: true, cursor: 'move', circle: true},
        {point: [50, 50], deletable: true, cursor: 'move', circle: true},
        {point: [30, 50], deletable: true, cursor: 'move', circle: true}
      ]
    );
  });

  it('marks polygon points as not deletable if too few are left', () => {
    const state = {
      ...initialState,
      mode: 'polygon',
      points: [[10, 10], [20, 20], [50, 50]]
    };

    expect(handles(state)).toMatchObject(
      [
        {point: [10, 10], deletable: false},
        {point: [20, 20], deletable: false},
        {point: [50, 50], deletable: false}
      ]
    );
  });

  it('includes mid points in rect mode', () => {
    const state = {
      ...initialState,
      mode: 'rect',
      points: [[10, 10], [30, 10], [30, 30], [10, 30]]
    };

    expect(handles(state)).toEqual(
      [
        {point: [10, 10], deletable: false, cursor: 'nwse-resize', axis: null},
        {point: [20, 10], deletable: false, cursor: 'ns-resize', axis: 'y'},
        {point: [30, 10], deletable: false, cursor: 'nesw-resize', axis: null},
        {point: [30, 20], deletable: false, cursor: 'ew-resize', axis: 'x'},
        {point: [30, 30], deletable: false, cursor: 'nwse-resize', axis: null},
        {point: [20, 30], deletable: false, cursor: 'ns-resize', axis: 'y'},
        {point: [10, 30], deletable: false, cursor: 'nesw-resize', axis: null},
        {point: [10, 20], deletable: false, cursor: 'ew-resize', axis: 'x'}
      ]
    );
  });
});
