describe('pageflow.CollectionView', function() {
  describe('with blankSlateViewConstructor option', function() {
    function createCollectionView(collection) {
      var BlankSlateView = Backbone.Marionette.View.extend({className: 'blank'});
      var ItemView = Backbone.Marionette.View.extend({className: 'item'});

      return new pageflow.CollectionView({
        collection: collection,
        itemViewConstructor: ItemView,
        blankSlateViewConstructor: BlankSlateView
      });
    }

    it('displays blank slate initially', function() {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();

      expect(collectionView.$el.find('.blank').length).to.eq(1);
    });

    it('removes blank slate when item is added', function() {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();
      collection.add([{name: 'something'}]);

      expect(collectionView.$el.find('.blank').length).to.eq(0);
    });
  });

  describe('with loadingViewConstructor and blankSlateViewConstructor option', function() {
    function createCollectionView(collection) {
      var LoadingView = Backbone.Marionette.View.extend({className: 'loading'});
      var BlankSlateView = Backbone.Marionette.View.extend({className: 'blank'});

      return new pageflow.CollectionView({
        collection: collection,
        loadingViewConstructor: LoadingView,
        blankSlateViewConstructor: BlankSlateView
      });
    }

    it('displays blank slate initially', function() {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();

      expect(collectionView.$el.find('.blank').length).to.eq(1);
    });

    it('displays loading view when collection starts request', function() {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();
      collection.trigger('request');

      expect(collectionView.$el.find('.loading').length).to.eq(1);
    });

    it('displays placeholder view again when collection syncs', function() {
      var collection = new Backbone.Collection();
      var collectionView = createCollectionView(collection);

      collectionView.render();
      collection.trigger('request');
      collection.trigger('sync');

      expect(collectionView.$el.find('.blank').length).to.eq(1);
    });
  });
});
