import {watch,
        createReducer as createCollectionReducer,
        createItemSelector as createCollectionItemSelector,
        createFirstItemSelector as createFirstCollectionItemSelector} from '../collections';

import Backbone from 'backbone';
import {createStore, combineReducers} from 'redux';

import {expect} from 'support/chai';

describe('collections', () => {
  beforeEach(function() {
    this.store = createStore(combineReducers({
      posts: createCollectionReducer('posts')
    }));

    this.getPost = createCollectionItemSelector('posts');
    this.getFirstPost = createFirstCollectionItemSelector('posts');
  });

  describe('keeping store data in sync with a Backbone collection', () => {
    it('initializes the store', function() {
      const postAttributes = {id: 5, title: 'Big news'};
      const collection = new Backbone.Collection([postAttributes]);

      watch({
        collection: collection,
        dispatch: this.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      expect(this.getPost({id: 5})(this.store.getState())).to.eql(postAttributes);
    });

    it('handles adding models', function() {
      const collection = new Backbone.Collection();
      const postAttributes = {id: 5, title: 'Big news'};

      watch({
        collection: collection,
        dispatch: this.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.add(postAttributes);

      expect(this.getPost({id: 5})(this.store.getState())).to.eql(postAttributes);
    });

    it('handles models changes', function() {
      const collection = new Backbone.Collection([{id: 5, title: 'Big news'}]);

      watch({
        collection: collection,
        dispatch: this.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.at(0).set('title', 'Old news');

      expect(this.getPost({id: 5})(this.store.getState()).title).to.eql('Old news');
    });

    it('handles removing models after delay', function(done) {
      const collection = new Backbone.Collection([{id: 5, title: 'Big news'}]);

      watch({
        collection: collection,
        dispatch: this.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.remove(5);

      setTimeout(function() {
        expect(this.getPost({id: 5})(this.store.getState())).to.eq(undefined);
        done();
      }.bind(this), 0);
    });

    it('initializes order of collection', function() {
      const collection = new Backbone.Collection(
        [
          {id: 5, title: 'Second', position: 2},
          {id: 6, title: 'First', position: 1}
        ],
        {comparator: 'position'}
      );

      watch({
        collection: collection,
        dispatch: this.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      expect(this.getFirstPost(this.store.getState()).title).to.eql('First');
    });

    it('updates order on add', function() {
      const collection = new Backbone.Collection(
        [{id: 5, title: 'Original first', position: 2}],
        {comparator: 'position'}
      );

      watch({
        collection: collection,
        dispatch: this.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.add({id: 6, title: 'New first', position: 1});

      expect(this.getFirstPost(this.store.getState()).title).to.eql('New first');
    });

    it('updates order on sort', function() {
      const collection = new Backbone.Collection(
        [
          {id: 5, title: 'Second', position: 2},
          {id: 6, title: 'First', position: 1}
        ],
        {comparator: 'position'}
      );

      watch({
        collection: collection,
        dispatch: this.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.first().set('position', 3);
      collection.sort();

      expect(this.getFirstPost(this.store.getState()).title).to.eql('Second');
    });

    it('updates order on remove after delay', function(done) {
      const collection = new Backbone.Collection(
        [
          {id: 5, title: 'Second', position: 2},
          {id: 6, title: 'First', position: 1}
        ],
        {comparator: 'position'}
      );

      watch({
        collection: collection,
        dispatch: this.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      collection.remove(6);

      setTimeout(() => {
        expect(this.getFirstPost(this.store.getState()).title).to.eql('Second');
        done();
      }, 0);
    });
  });

  describe('loading from seed data', () => {
    it('initializes the store', function() {
      const post = {id: 5, title: 'Big news'};
      const collection = [post];

      watch({
        collection: collection,
        dispatch: this.store.dispatch,
        collectionName: 'posts',
        attributes: ['id', 'title']
      });

      expect(this.getPost({id: 5})(this.store.getState())).to.eql(post);
    });
  });
});
