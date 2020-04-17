import commonPageStateReducer from '../commonPageStateReducer';
import {pageWillActivate, pageWillDeactivate, pageDidPreload, pageDidPrepare, pageDidUnprepare} from '../actions';


describe('commonPageStateReducer', () => {
  it('sets default properties', () => {
    const state = {};

    const result = commonPageStateReducer(state, {type: 'INIT'});

    expect(Object.keys(result)).toEqual(expect.arrayContaining([
      'isActive', 'isActivated', 'isPrepared', 'isPreloaded', 'initialScrollerPosition'
    ]));
  });

  it('on "will activate" action sets isActive to true', () => {
    const state = {};

    const result = commonPageStateReducer(state, pageWillActivate({id: 5}));

    expect(result.isActive).toBe(true);
  });

  it('on "will deactivate" action sets isActive to false', () => {
    const state = {isActive: true};

    const result = commonPageStateReducer(state, pageWillDeactivate({id: 5}));

    expect(result.isActive).toBe(false);
  });

  it('on "did preload" action sets isPreloaded to true', () => {
    const state = {};

    const result = commonPageStateReducer(state, pageDidPreload({id: 5}));

    expect(result.isPreloaded).toBe(true);
  });

  it('on "did prepare" action sets isPrepared to true', () => {
    const state = {};

    const result = commonPageStateReducer(state, pageDidPrepare({id: 5}));

    expect(result.isPrepared).toBe(true);
  });

  it('on "did unprepare" action sets isPrepared to true', () => {
    const state = {isPrepared: true};

    const result = commonPageStateReducer(state, pageDidUnprepare({id: 5}));

    expect(result.isPrepared).toBe(false);
  });

  it(
    'does not change state for unknown actions if default keys are present',
    () => {
      const state = {};

      const reducedOnce = commonPageStateReducer(state, {type: 'INIT'});
      const reducedTwice = commonPageStateReducer(reducedOnce, {type: 'ANY'});

      expect(reducedOnce).toBe(reducedTwice);
    }
  );

  it(
    'on "will activate" action with position sets initialScrollerPosition',
    () => {
      const state = {};

      const result = commonPageStateReducer(state, pageWillActivate({id: 5, position: 'bottom'}));

      expect(result.initialScrollerPosition).toBe('bottom');
    }
  );

  it(
    'on "will activate" action without position sets startsAtBottom to top',
    () => {
      const state = {};

      const result = commonPageStateReducer(state, pageWillActivate({id: 5}));

      expect(result.initialScrollerPosition).toBe('top');
    }
  );

  it('on "will deactivate" action resets initialScrollerPosition', () => {
    const state = {initialScrollerPosition: 'top'};

    const result = commonPageStateReducer(state, pageWillDeactivate({id: 5}));

    expect(result.initialScrollerPosition).toBeNull();
  });
});
