import {watch,
        createReducer as createCollectionReducer,
        createItemSelector as createCollectionItemSelector,
        createFirstItemSelector as createFirstCollectionItemSelector} from '../collections';

import Backbone from 'backbone';
import {createStore, combineReducers} from 'redux';


describe('collections', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.store = createStore(combineReducers({
      posts: createCollectionReducer('posts')
    }));

    testContext.getPost = createCollectionItemSelector('posts');
    testContext.getFirstPost = createFirstCollectionItemSelector('posts');
  });

  describe('keeping store data in sync with a Backbone collection', () => {
    it('initializes the store', () => {
      const postAttributes = {id: 5, title: 'Big news'};
      const collection = new Backbone.Collection([postAttributes]);

      watch({
        collection: collection,
        dispatch: testContext.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      expect(testContext.getPost({id: 5})(testContext.store.getState())).toEqual(postAttributes);
    });

    it('handles adding models', () => {
      const collection = new Backbone.Collection();
      const postAttributes = {id: 5, title: 'Big news'};

      watch({
        collection: collection,
        dispatch: testContext.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.add(postAttributes);

      expect(testContext.getPost({id: 5})(testContext.store.getState())).toEqual(postAttributes);
    });

    it('handles models changes', () => {
      const collection = new Backbone.Collection([{id: 5, title: 'Big news'}]);

      watch({
        collection: collection,
        dispatch: testContext.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.at(0).set('title', 'Old news');

      expect(testContext.getPost({id: 5})(testContext.store.getState()).title).toBe('Old news');
    });

    it('handles removing models after delay', done => {
      const collection = new Backbone.Collection([{id: 5, title: 'Big news'}]);

      watch({
        collection: collection,
        dispatch: testContext.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.remove(5);

      setTimeout(function() {
        expect(testContext.getPost({id: 5})(testContext.store.getState())).toBeUndefined();
        done();
      }.bind(this), 0);
    });

    it('initializes order of collection', () => {
      const collection = new Backbone.Collection(
        [
          {id: 5, title: 'Second', position: 2},
          {id: 6, title: 'First', position: 1}
        ],
        {comparator: 'position'}
      );

      watch({
        collection: collection,
        dispatch: testContext.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      expect(testContext.getFirstPost(testContext.store.getState()).title).toBe('First');
    });

    it('updates order on add', () => {
      const collection = new Backbone.Collection(
        [{id: 5, title: 'Original first', position: 2}],
        {comparator: 'position'}
      );

      watch({
        collection: collection,
        dispatch: testContext.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.add({id: 6, title: 'New first', position: 1});

      expect(testContext.getFirstPost(testContext.store.getState()).title).toBe('New first');
    });

    it('updates order on sort', () => {
      const collection = new Backbone.Collection(
        [
          {id: 5, title: 'Second', position: 2},
          {id: 6, title: 'First', position: 1}
        ],
        {comparator: 'position'}
      );

      watch({
        collection: collection,
        dispatch: testContext.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.first().set('position', 3);
      collection.sort();

      expect(testContext.getFirstPost(testContext.store.getState()).title).toBe('Second');
    });

    it('updates order on remove after delay', done => {
      const collection = new Backbone.Collection(
        [
          {id: 5, title: 'Second', position: 2},
          {id: 6, title: 'First', position: 1}
        ],
        {comparator: 'position'}
      );

      watch({
        collection: collection,
        dispatch: testContext.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.remove(6);

      setTimeout(() => {
        expect(testContext.getFirstPost(testContext.store.getState()).title).toBe('Second');
        done();
      }, 0);
    });
  });

  describe('loading from seed data', () => {
    it('initializes the store', () => {
      const post = {id: 5, title: 'Big news'};
      const collection = [post];

      watch({
        collection: collection,
        dispatch: testContext.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      expect(testContext.getPost({id: 5})(testContext.store.getState())).toEqual(post);
    });
  });
});
