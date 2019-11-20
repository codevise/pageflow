import createPageStateReducer from '../createPageStateReducer';

import {change} from 'collections/actions';


describe('createPageStateReducer', () => {
  describe('returns a reducer that', () => {
    const pageTypeStateReducers = {
      video: function(state = {}, action) {
        switch (action) {
        case 'PLAY':
          return {...state, isPlaying: true};
        default:
          return state;
        }
      }
    };

    it('applies reducer for page type of page to custom page state', () => {
      const page = {attributes: {type: 'video'}};
      const reducer = createPageStateReducer(pageTypeStateReducers);

      const reducedPage = reducer(page, 'PLAY');

      expect(reducedPage.state.custom.isPlaying).toBe(true);
    });

    it('does not alter attributes', () => {
      const page = {attributes: {type: 'video'}};
      const reducer = createPageStateReducer(pageTypeStateReducers);

      const reducedPage = reducer(page, 'PLAY');

      expect(reducedPage.attributes.type).toBe('video');
    });

    it('does not applies reducer for other page type', () => {
      const page = {attributes: {type: 'audio'}};
      const reducer = createPageStateReducer(pageTypeStateReducers);

      const reducedPage = reducer(page, 'PLAY');

      expect(reducedPage.state.custom.isPlaying).toBeUndefined();
    });

    it('returns same page if state did not change', () => {
      const page = {attributes: {type: 'video'}};
      const reducer = createPageStateReducer(pageTypeStateReducers);

      const initializedPage = reducer(page, 'INIT');
      const reducedPage = reducer(initializedPage, 'UNKNOWN');

      expect(reducedPage).toBe(initializedPage);
    });

    it('resets custom page state when type changes', () => {
      const page = {
        attributes: {type: 'audio'},
        state: {custom: {old: 'value'}}
      };
      const reducer = createPageStateReducer(pageTypeStateReducers);

      const reducedPage = reducer(page, change({
        collectionName: 'pages',
        attributes: {type: 'video'}
      }));

      expect(reducedPage.attributes.type).toBe('video');
      expect(reducedPage.state.custom).toEqual({});
    });
  });
});
