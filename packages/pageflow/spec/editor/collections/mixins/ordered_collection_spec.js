describe('orderedCollection', function() {
  support.useFakeXhr();

  var Item = Backbone.Model.extend({
    paramRoot: 'item'
  });

  var Parent = Backbone.Model.extend({
    paramRoot: 'parent'
  });

  var OrderedCollection = Backbone.Collection.extend({
    mixins: [pageflow.orderedCollection],
    url: function() { return '/fake'; },

    comparator: function(item) {
      return item.get('position');
    }
  });

  describe('#consolidatePositions', function() {
    it('updates position attributes', function() {
      var collection = new OrderedCollection([
        new Item(),
        new Item(),
        new Item()
      ]);

      collection.consolidatePositions();

      expect(collection.pluck('position')).to.eql([0,1,2]);
    });
  });

  describe('#saveOrder', function() {
    it('sends patch request to /order', function() {
      var first = new Item({position: 0});
      var second = new Item({position: 1});
      var third = new Item({position: 2});
      var collection = new OrderedCollection([first, second, third]);
      collection.parentModel = new Parent();

      collection.saveOrder();

      expect(this.requests[0].url).to.eq('/fake/order');
    });
  });

  describe('removing an item', function() {
    it('consolidates positions', function() {
      var first = new Item({position: 0});
      var second = new Item({position: 1});
      var third = new Item({position: 2});
      var collection = new OrderedCollection([first, second, third]);
      collection.parentModel = new Parent();

      collection.remove(second);

      expect(third.get('position')).to.eq(1);
    });
  });
});