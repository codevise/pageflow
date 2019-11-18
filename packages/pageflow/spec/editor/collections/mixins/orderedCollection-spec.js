import Backbone from 'backbone';

import {orderedCollection} from '$pageflow/editor';

import * as support from '$support';

describe('orderedCollection', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  support.useFakeXhr(() => testContext);

  var Item = Backbone.Model.extend({
    paramRoot: 'item'
  });

  var Parent = Backbone.Model.extend({
    paramRoot: 'parent'
  });

  var OrderedCollection = Backbone.Collection.extend({
    mixins: [orderedCollection],
    url: function() { return '/fake'; },

    comparator: function(item) {
      return item.get('position');
    }
  });

  describe('#consolidatePositions', () => {
    test('updates position attributes', () => {
      var collection = new OrderedCollection([
        new Item(),
        new Item(),
        new Item()
      ]);

      collection.consolidatePositions();

      expect(collection.pluck('position')).toEqual([0,1,2]);
    });
  });

  describe('#saveOrder', () => {
    test('sends patch request to /order', () => {
      var first = new Item({position: 0});
      var second = new Item({position: 1});
      var third = new Item({position: 2});
      var collection = new OrderedCollection([first, second, third]);
      collection.parentModel = new Parent();

      collection.saveOrder();

      expect(testContext.requests[0].url).toBe('/fake/order');
    });
  });

  describe('removing an item', () => {
    test('consolidates positions', () => {
      var first = new Item({position: 0});
      var second = new Item({position: 1});
      var third = new Item({position: 2});
      var collection = new OrderedCollection([first, second, third]);
      collection.parentModel = new Parent();

      collection.remove(second);

      expect(third.get('position')).toBe(1);
    });
  });
});
