import Backbone from 'backbone';

import {SubsetCollection} from '$pageflow/editor';

import sinon from 'sinon';

describe('SubsetCollection', () => {
  var ParentCollection = Backbone.Collection.extend({
    comparator: function(item) {
      return item.get('position');
    }
  });

  test('propagates sort to parent', () => {
    var parentCollection = new ParentCollection([
      {position: 0, inSubset: true},
      {position: 1, inSubset: true},
      {position: 2, inSubset: false}
    ]);
    var subsetCollection = new SubsetCollection({
      parent: parentCollection,

      filter: function(item) {
        return item.get('inSubset');
      }
    });

    subsetCollection.at(1).set('position', 10);
    subsetCollection.sort();

    expect(parentCollection.pluck('position')).toEqual([0, 2, 10]);
  });

  describe('with sortOnParentSort option set to true', () => {
    test('sorts when parent is sorted', () => {
      var parentCollection = new ParentCollection([
        {position: 0, inSubset: true},
        {position: 1, inSubset: false},
        {position: 2, inSubset: true}
      ]);
      var subsetCollection = new SubsetCollection({
        parent: parentCollection,
        sortOnParentSort: true,

        filter: function(item) {
          return item.get('inSubset');
        }
      });

      parentCollection.at(0).set('position', 10);
      parentCollection.sort();

      expect(subsetCollection.pluck('position')).toEqual([2, 10]);
    });

    test(
      'does not propagate sort back to parent if sort origininated on parent',
      () => {
        var parentCollection = new ParentCollection([
          {position: 0, inSubset: true},
          {position: 1, inSubset: false},
          {position: 2, inSubset: true}
        ]);
        new SubsetCollection({
          parent: parentCollection,
          sortOnParentSort: true,

          filter: function(item) {
            return item.get('inSubset');
          }
        });
        var sortEventHandler = sinon.spy();

        parentCollection.at(0).set('position', 10);
        parentCollection.on('sort', sortEventHandler);
        parentCollection.sort();

        expect(sortEventHandler).toHaveBeenCalledOnce();
      }
    );

    test('does not sort again in response to propagated parent sort', () => {
      var parentCollection = new ParentCollection([
        {position: 0, inSubset: true},
        {position: 1, inSubset: true},
        {position: 2, inSubset: false}
      ]);
      var subsetCollection = new SubsetCollection({
        parent: parentCollection,
        sortOnParentSort: true,

        filter: function(item) {
          return item.get('inSubset');
        }
      });
      var sortEventHandler = sinon.spy();

      subsetCollection.at(1).set('position', 10);
      subsetCollection.on('sort', sortEventHandler);
      subsetCollection.sort();

      expect(sortEventHandler).toHaveBeenCalledOnce();
    });
  });
});