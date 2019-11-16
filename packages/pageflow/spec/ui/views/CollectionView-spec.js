describe('pageflow.CollectionView', () => {
  describe('with blankSlateViewConstructor option', () => {
    function createCollectionView(collection) {
      var BlankSlateView = Backbone.Marionette.View.extend({className: 'blank'});
      var ItemView = Backbone.Marionette.View.extend({className: 'item'});

      return new pageflow.CollectionView({
        collection: collection,
        itemViewConstructor: ItemView,
        blankSlateViewConstructor: BlankSlateView
      });
    }

    test('displays blank slate initially', () => {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();

      expect(collectionView.$el.find('.blank').length).toBe(1);
    });

    test('removes blank slate when item is added', () => {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();
      collection.add([{name: 'something'}]);

      expect(collectionView.$el.find('.blank').length).toBe(0);
    });
  });

  describe('with loadingViewConstructor and blankSlateViewConstructor option', () => {
    function createCollectionView(collection) {
      var LoadingView = Backbone.Marionette.View.extend({className: 'loading'});
      var BlankSlateView = Backbone.Marionette.View.extend({className: 'blank'});

      return new pageflow.CollectionView({
        collection: collection,
        loadingViewConstructor: LoadingView,
        blankSlateViewConstructor: BlankSlateView
      });
    }

    test('displays blank slate initially', () => {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();

      expect(collectionView.$el.find('.blank').length).toBe(1);
    });

    test('displays loading view when collection starts request', () => {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();
      collection.trigger('request');

      expect(collectionView.$el.find('.loading').length).toBe(1);
    });

    test('displays placeholder view again when collection syncs', () => {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();
      collection.trigger('request');
      collection.trigger('sync');

      expect(collectionView.$el.find('.blank').length).toBe(1);
    });
  });
});
