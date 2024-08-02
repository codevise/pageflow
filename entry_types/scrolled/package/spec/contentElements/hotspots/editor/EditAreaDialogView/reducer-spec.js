import {
  reducer,
  drawnOutlinePoints,
  handles,
  SET_MODE,
  DRAG,
  CLICK_HANDLE,
  DRAG_HANDLE,
  DRAG_HANDLE_STOP,
  DOUBLE_CLICK_HANDLE,
  MOUSE_MOVE,
  DRAG_POTENTIAL_POINT,
  DRAG_POTENTIAL_POINT_STOP,
  CLICK_INDICATOR,
  DRAG_INDICATOR,
  CENTER_INDICATOR,
  UPDATE_SELECTION_POSITION,
  BLUR_SELECTION_POSITION
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

    it('resets selection', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 2});
      state = reducer(state, {type: SET_MODE, value: 'rect'});

      expect(state.selection).toBeNull();
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

  describe('CLICK_HANDLE', () => {
    describe('in polygon mode', () => {
      it('sets selection for handle', () => {
        let state = {
          ...initialState,
          mode: 'polygon',
          points: [[10, 20], [20, 20.123], [50, 10], [50, 50], [10, 50]]
        };
        state = reducer(state, {type: CLICK_HANDLE, index: 1});

        expect(state.selection).toEqual({
          type: 'handle',
          index: 1,
          position: [20, 20.1]
        });
      });
    });

    describe('in rect mode', () => {
      it('sets selection for top mid point handle', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: CLICK_HANDLE, index: 1});

        expect(state.selection).toEqual({
          type: 'handle',
          axis: 'y',
          index: 1,
          position: [15, 20]
        });
      });

      it('sets selection for left mid point handle', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: CLICK_HANDLE, index: 7});

        expect(state.selection).toEqual({
          type: 'handle',
          axis: 'x',
          index: 7,
          position: [10, 30]
        });
      });

      it('sets selection for corner handle', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20.543, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: CLICK_HANDLE, index: 2});

        expect(state.selection).toEqual({
          type: 'handle',
          axis: 'both',
          index: 2,
          position: [20.5, 20]
        });
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

      it('sets selection for handle', () => {
        let state = {
          ...initialState,
          mode: 'polygon',
          points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 1, cursor: [30.42, 25]});

        expect(state.selection).toEqual({
          type: 'handle',
          index: 1,
          position: [30.4, 25]
        });
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

      it('ignores cross-axis coordinate of mid point handle', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 1, cursor: [25, 10]});

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

      it('sets selection for top mid point handle', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 1, cursor: [14, 10]});

        expect(state.selection).toEqual({
          type: 'handle',
          axis: 'y',
          index: 1,
          position: [15, 10]
        });
      });

      it('sets selection for left mid point handle', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 7, cursor: [8, 28]});

        expect(state.selection).toEqual({
          type: 'handle',
          axis: 'x',
          index: 7,
          position: [8, 30]
        });
      });

      it('sets selection for corner handle', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 2, cursor: [22.45, 19]});

        expect(state.selection).toEqual({
          type: 'handle',
          axis: 'both',
          index: 2,
          position: [22.5, 19]
        });
      });

      it('changes selected handle when moving top left corner handle past bottom right boundary', () => {
        let state = {
          ...initialState,
          mode: 'rect',
          points: [[10, 20], [20, 20], [20, 40], [10, 40]]
        };
        state = reducer(state, {type: DRAG_HANDLE, index: 0, cursor: [10, 20]});
        state = reducer(state, {type: DRAG_HANDLE, index: 0, cursor: [30, 50]});

        expect(state.selection.index).toEqual(4);
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

    it('resets selection', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 1});
      state = reducer(state, {type: DOUBLE_CLICK_HANDLE, index: 1});

      expect(state.selection).toBeNull();
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

    it('sets selection to potential point', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: DRAG_POTENTIAL_POINT, cursor: [20.1234, 10]});

      expect(state.selection).toEqual({
        type: 'potentialPoint',
        position: [20.1, 10]
      });
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

    it('selected handle of new point', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 20], [50, 10], [50, 50], [10, 50]]
      };
      state = reducer(state, {type: MOUSE_MOVE, cursor: [20, 10]});
      state = reducer(state, {type: DRAG_POTENTIAL_POINT, cursor: [20.123, 10]});
      state = reducer(state, {type: DRAG_POTENTIAL_POINT_STOP});

      expect(state.selection).toEqual({
        type: 'handle',
        index: 1,
        position: [20.1, 10]
      });
    });
  });

  describe('CLICK_INDICATOR', () => {
    it('sets selection', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 10], [20, 50]],
        indicatorPosition: [11, 11.123]
      };
      state = reducer(state, {type: CLICK_INDICATOR});

      expect(state.selection).toEqual({
        type: 'indicator',
        position: [11, 11.1]
      });
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

    it('sets selection', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 10], [20, 50]],
        indicatorPosition: [11, 11]
      };
      state = reducer(state, {type: DRAG_INDICATOR, cursor: [15, 11.123]});

      expect(state.selection).toEqual({
        type: 'indicator',
        position: [15, 11.1]
      });
    });
  });

  describe('CENTER_INDICATOR', () => {
    it('centers indicator position', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 10], [20, 10], [20, 50], [10, 50]],
        indicatorPosition: [11, 11]
      };
      state = reducer(state, {type: CENTER_INDICATOR});

      expect(state.indicatorPosition).toEqual([15, 30]);
    });
  });

  describe('UPDATE_SELECTION_POSITION', () => {
    it('updates indicator position', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 10], [20, 50]],
        indicatorPosition: [11, 11]
      };
      state = reducer(state, {type: CLICK_INDICATOR});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [12, 11]});

      expect(state.indicatorPosition).toEqual([12, 11]);
      expect(state.selection.position).toEqual([12, 11]);
    });

    it('allows invalid indicator position in selection', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 10], [20, 50]],
        indicatorPosition: [11, 11]
      };
      state = reducer(state, {type: CLICK_INDICATOR});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [0, 0]});

      expect(state.indicatorPosition).toEqual([10, 10]);
      expect(state.selection.position).toEqual([0, 0]);
    });

    it('allows invalid handle position in selection', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 10], [20, 50]],
        indicatorPosition: [11, 11]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 1});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [-10, 120]});

      expect(state.points[1]).toEqual([0, 100]);
      expect(state.selection.position).toEqual([-10, 120]);
    });

    it('updates polygon handle position', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 10], [20, 50]],
        indicatorPosition: [11, 11]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 1});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [12, 11]});

      expect(state.points[1]).toEqual([12, 11]);
      expect(state.selection.position).toEqual([12, 11]);
    });

    it('updates rect corner handle position', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 40], [10, 40]]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 2});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [22, 22]});

      expect(state.points).toEqual(
        [[10, 22], [22, 22], [22, 40], [10, 40]]
      );
    });

    it('updates rect top mid point handle position', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 40], [10, 40]]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 1});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [15, 10]});

      expect(state.points).toEqual(
        [[10, 10], [20, 10], [20, 40], [10, 40]]
      );
    });

    it('changes selected handle when moving right mid point handle past left boundary', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 40], [10, 40]]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 3});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [20, 30]});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [5, 30]});

      expect(state.selection.index).toEqual(7);
    });

    it('changes selected handle when moving left mid point handle past right boundary', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 40], [10, 40]]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 7});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [10, 30]});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [25, 30]});

      expect(state.selection.index).toEqual(3);
    });

    it('changes selected handle when moving top mid point handle past bottom boundary', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 40], [10, 40]]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 1});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [15, 20]});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [15, 50]});

      expect(state.selection.index).toEqual(5);
    });

    it('changes selected handle when moving bottom mid point handle past top boundary', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 40], [10, 40]]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 5});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [15, 40]});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [15, 10]});

      expect(state.selection.index).toEqual(1);
    });

    it('changes selected handle when moving top right corner handle past left boundary', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 40], [10, 40]]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 2});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [20, 20]});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [5, 20]});

      expect(state.selection.index).toEqual(0);
    });

    it('changes selected handle when moving top left corner handle past bottom boundary', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 40], [10, 40]]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 0});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [10, 20]});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [10, 50]});

      expect(state.selection.index).toEqual(6);
    });
  });

  describe('BLUR_SELECTION_POSITION', () => {
    it('sanitizes indicator position in selection', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 10], [20, 50]],
        indicatorPosition: [11, 11]
      };
      state = reducer(state, {type: CLICK_INDICATOR});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [0, 0]});
      state = reducer(state, {type: BLUR_SELECTION_POSITION});

      expect(state.indicatorPosition).toEqual([10, 10]);
      expect(state.selection.position).toEqual([10, 10]);
    });

    it('keeps handle selection unchanged', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 10], [20, 10], [20, 50]],
        indicatorPosition: [12, 12]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 0});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [10, 11]});
      state = reducer(state, {type: BLUR_SELECTION_POSITION});

      expect(state.selection.position).toEqual([10, 11]);
    });

    it('sanitizes polygon handle position in selection', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [15, 50]],
        indicatorPosition: [10, 20]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 0});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [-10, 120]});
      state = reducer(state, {type: BLUR_SELECTION_POSITION});

      expect(state.selection.position).toEqual([0, 100]);
    });

    it('sanitizes rect handle position in selection', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 40], [10, 40]],
        indicatorPosition: [10, 20]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 2});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [120, -10]});
      state = reducer(state, {type: BLUR_SELECTION_POSITION});

      expect(state.selection.position).toEqual([100, 0]);
    });

    it('moves indicator inside area', () => {
      let state = {
        ...initialState,
        mode: 'polygon',
        points: [[10, 20], [20, 20], [50, 10], [50, 50], [15, 50]],
        indicatorPosition: [10, 20]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 0});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [15, 20]});
      state = reducer(state, {type: BLUR_SELECTION_POSITION});

      expect(state.indicatorPosition).toEqual([15, 20]);
    });

    it('resets start points for next drag handle', () => {
      let state = {
        ...initialState,
        mode: 'rect',
        points: [[10, 20], [20, 20], [20, 40], [10, 40]],
        indicatorPosition: [10, 20]
      };
      state = reducer(state, {type: CLICK_HANDLE, index: 3});
      state = reducer(state, {type: UPDATE_SELECTION_POSITION, position: [19, 30]});
      state = reducer(state, {type: BLUR_SELECTION_POSITION});
      state = reducer(state, {type: DRAG_HANDLE, index: 7, cursor: [11, 30]});

      expect(state.points).toEqual([[11, 20], [19, 20], [19, 40], [11, 40]]);
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
