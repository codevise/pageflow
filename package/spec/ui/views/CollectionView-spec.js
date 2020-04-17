import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {CollectionView} from 'pageflow/ui';

describe('pageflow.CollectionView', () => {
  describe('with blankSlateViewConstructor option', () => {
    function createCollectionView(collection) {
      var BlankSlateView = Marionette.View.extend({className: 'blank'});
      var ItemView = Marionette.View.extend({className: 'item'});

      return new CollectionView({
        collection: collection,
        itemViewConstructor: ItemView,
        blankSlateViewConstructor: BlankSlateView
      });
    }

    it('displays blank slate initially', () => {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();

      expect(collectionView.$el.find('.blank').length).toBe(1);
    });

    it('removes blank slate when item is added', () => {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();
      collection.add([{name: 'something'}]);

      expect(collectionView.$el.find('.blank').length).toBe(0);
    });
  });

  describe('with loadingViewConstructor and blankSlateViewConstructor option', () => {
    function createCollectionView(collection) {
      var LoadingView = Marionette.View.extend({className: 'loading'});
      var BlankSlateView = Marionette.View.extend({className: 'blank'});

      return new CollectionView({
        collection: collection,
        loadingViewConstructor: LoadingView,
        blankSlateViewConstructor: BlankSlateView
      });
    }

    it('displays blank slate initially', () => {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();

      expect(collectionView.$el.find('.blank').length).toBe(1);
    });

    it('displays loading view when collection starts request', () => {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();
      collection.trigger('request');

      expect(collectionView.$el.find('.loading').length).toBe(1);
    });

    it('displays placeholder view again when collection syncs', () => {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();
      collection.trigger('request');
      collection.trigger('sync');

      expect(collectionView.$el.find('.blank').length).toBe(1);
    });
  });
});
