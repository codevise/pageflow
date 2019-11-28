import commonPageStateReducer from '../commonPageStateReducer';
import {pageWillActivate, pageWillDeactivate, pageDidPreload, pageDidPrepare, pageDidUnprepare} from '../actions';

import {expect} from 'support/chai';

describe('commonPageStateReducer', () => {
  it('sets default properties', () => {
    const state = {};

    const result = commonPageStateReducer(state, {type: 'INIT'});

    expect(result).to.have.keys([
      'isActive', 'isActivated', 'isPrepared', 'isPreloaded', 'initialScrollerPosition'
    ]);
  });

  it('on "will activate" action sets isActive to true', () => {
    const state = {};

    const result = commonPageStateReducer(state, pageWillActivate({id: 5}));

    expect(result.isActive).to.eq(true);
  });

  it('on "will deactivate" action sets isActive to false', () => {
    const state = {isActive: true};

    const result = commonPageStateReducer(state, pageWillDeactivate({id: 5}));

    expect(result.isActive).to.eq(false);
  });

  it('on "did preload" action sets isPreloaded to true', () => {
    const state = {};

    const result = commonPageStateReducer(state, pageDidPreload({id: 5}));

    expect(result.isPreloaded).to.eq(true);
  });

  it('on "did prepare" action sets isPrepared to true', () => {
    const state = {};

    const result = commonPageStateReducer(state, pageDidPrepare({id: 5}));

    expect(result.isPrepared).to.eq(true);
  });

  it('on "did unprepare" action sets isPrepared to true', () => {
    const state = {isPrepared: true};

    const result = commonPageStateReducer(state, pageDidUnprepare({id: 5}));

    expect(result.isPrepared).to.eq(false);
  });

  it('does not change state for unknown actions if default keys are present', () => {
    const state = {};

    const reducedOnce = commonPageStateReducer(state, {type: 'INIT'});
    const reducedTwice = commonPageStateReducer(reducedOnce, {type: 'ANY'});

    expect(reducedOnce).to.eq(reducedTwice);
  });

  it('on "will activate" action with position sets initialScrollerPosition', () => {
    const state = {};

    const result = commonPageStateReducer(state, pageWillActivate({id: 5, position: 'bottom'}));

    expect(result.initialScrollerPosition).to.eq('bottom');
  });

  it('on "will activate" action without position sets startsAtBottom to top', () => {
    const state = {};

    const result = commonPageStateReducer(state, pageWillActivate({id: 5}));

    expect(result.initialScrollerPosition).to.eq('top');
  });

  it('on "will deactivate" action resets initialScrollerPosition', () => {
    const state = {initialScrollerPosition: 'top'};

    const result = commonPageStateReducer(state, pageWillDeactivate({id: 5}));

    expect(result.initialScrollerPosition).to.eq(null);
  });
});
