import watchBackboneCollection from '../watchBackboneCollection';
import {RESET, CHANGE, ORDER} from '../actions';

import Backbone from 'backbone';

import sinon from 'sinon';

describe('watchBackboneCollection', () => {
  it('dispatches reset action initially', () => {
    const postAttributes = {title: 'News'};
    const collection = new Backbone.Collection([postAttributes]);
    const dispatch = sinon.spy();

    watchBackboneCollection({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: ['title']
    });

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: RESET,
      payload: {
        collectionName: 'posts',
        items: [postAttributes]
      }
    }));
  });

  it('camelized attribute', () => {
    const postAttributes = {long_title: 'News'};
    const collection = new Backbone.Collection([postAttributes]);
    const dispatch = sinon.spy();

    watchBackboneCollection({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: ['long_title']
    });

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: RESET,
      payload: {
        items: [{longTitle: 'News'}]
      }
    }));
  });

  it('supports mapping attribute names', () => {
    const postAttributes = {post_type: 'gallery'};
    const collection = new Backbone.Collection([postAttributes]);
    const dispatch = sinon.spy();

    watchBackboneCollection({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: [{type: 'post_type'}]
    });

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: RESET,
      payload: {
        items: [{type: 'gallery'}]
      }
    }));
  });

  it('supports including configuration attributes', () => {
    const model = new Backbone.Model();
    model.configuration = new Backbone.Model({some: 'setting'});
    const collection = new Backbone.Collection([model]);
    const dispatch = sinon.spy();

    watchBackboneCollection({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: [],
      includeConfiguration: true
    });

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: RESET,
      payload: {
        items: [{some: 'setting'}]
      }
    }));
  });

  it('dispatches change action when used attribute changes', () => {
    const model = new Backbone.Model();
    const collection = new Backbone.Collection([model]);
    const dispatch = sinon.spy();

    watchBackboneCollection({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: ['title']
    });

    model.set('title', 'changed');

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: CHANGE,
      payload: {
        attributes: {title: 'changed'}
      }
    }));
  });

  it(
    'dispatches change action when attribute with mapped name changes',
    () => {
      const model = new Backbone.Model();
      const collection = new Backbone.Collection([model]);
      const dispatch = sinon.spy();

      watchBackboneCollection({
        collectionName: 'posts',
        collection,
        dispatch,
        attributes: [{fullTitle: 'full_title'}]
      });

      model.set('full_title', 'changed');

      expect(dispatch).toHaveBeenCalledWith(sinon.match({
        type: CHANGE,
        payload: {
          attributes: {fullTitle: 'changed'}
        }
      }));
    }
  );

  it('does not dispatch change action when unused attribute changes', () => {
    const model = new Backbone.Model();
    const collection = new Backbone.Collection([model]);
    const dispatch = sinon.spy();

    watchBackboneCollection({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: ['title']
    });

    model.set('other', 'changed');

    expect(dispatch).not.toHaveBeenCalledWith(sinon.match({
      type: CHANGE
    }));
  });

  it(
    'does not dispatch multiple change actions when multple attribute change at once',
    () => {
      const model = new Backbone.Model();
      const collection = new Backbone.Collection([model]);
      const dispatch = sinon.spy();

      watchBackboneCollection({
        collectionName: 'posts',
        collection,
        dispatch,
        attributes: ['title', 'body']
      });

      dispatch.reset();

      model.set({
        title: 'changed',
        body: 'changed'
      });

      expect(dispatch).toHaveBeenCalledOnce();
    }
  );

  it(
    'dispatches change action on change:confguration event when configuration is included ',
    () => {
      const model = new Backbone.Model();
      model.configuration = new Backbone.Model({some: 'setting'});
      const collection = new Backbone.Collection([model]);
      const dispatch = sinon.spy();

      watchBackboneCollection({
        collectionName: 'posts',
        collection,
        dispatch,
        attributes: [],
        includeConfiguration: true
      });

      model.configuration.set('some', 'changed');
      model.trigger('change:configuration', model);

      expect(dispatch).toHaveBeenCalledWith(sinon.match({
        type: CHANGE,
        payload: {
          attributes: {some: 'changed'}
        }
      }));
    }
  );

  it('dispatches order action on sort event', () => {
    const model = new Backbone.Model({id: 5, position: 1});
    const collection = new Backbone.Collection([model], {comparator: 'position'});
    const dispatch = sinon.spy();

    watchBackboneCollection({
      collectionName: 'posts',
      collection,
      dispatch,
      attributes: ['title']
    });

    collection.sort();

    expect(dispatch).toHaveBeenCalledWith(sinon.match({
      type: ORDER,
      payload: {
        order: [5]
      }
    }));
  });
});
