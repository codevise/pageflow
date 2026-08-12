import Backbone from 'backbone';

import {ConcatenatedCollection} from 'pageflow/editor';

describe('ConcatenatedCollection', () => {
  var byName = function(model) {
    return model.get('name');
  };

  function collection(names, options) {
    return new Backbone.Collection(names.map(name => ({name})), options);
  }

  it('contains models of all given collections', () => {
    var folders = collection(['folder']);
    var files = collection(['file']);

    var items = new ConcatenatedCollection({collections: [folders, files]});

    expect(items.pluck('name')).toEqual(['folder', 'file']);
  });

  it('lists models of each collection in the order of the collections', () => {
    var folders = collection(['b']);
    var files = collection(['a']);

    var items = new ConcatenatedCollection({collections: [folders, files]});

    expect(items.pluck('name')).toEqual(['b', 'a']);
  });

  it('keeps the order inside each collection', () => {
    var folders = collection(['d', 'c'], {comparator: byName});
    var files = collection(['b', 'a'], {comparator: byName});

    var items = new ConcatenatedCollection({collections: [folders, files]});

    expect(items.pluck('name')).toEqual(['c', 'd', 'a', 'b']);
  });

  it('adds model in the section of its collection', () => {
    var folders = collection(['b']);
    var files = collection(['a']);
    var items = new ConcatenatedCollection({collections: [folders, files]});

    folders.add({name: 'c'});

    expect(items.pluck('name')).toEqual(['b', 'c', 'a']);
  });

  it('adds model at its position inside the collection', () => {
    var folders = collection(['b', 'd'], {comparator: byName});
    var files = collection(['a']);
    var items = new ConcatenatedCollection({collections: [folders, files]});

    folders.add({name: 'c'});

    expect(items.pluck('name')).toEqual(['b', 'c', 'd', 'a']);
  });

  it('removes model when it is removed from one of the collections', () => {
    var folders = collection(['folder']);
    var files = collection(['file']);
    var items = new ConcatenatedCollection({collections: [folders, files]});

    folders.remove(folders.first());

    expect(items.pluck('name')).toEqual(['file']);
  });

  it('reorders models when one of the collections is sorted', () => {
    var folders = collection(['folder']);
    var files = collection(['a', 'b'], {comparator: byName});
    var items = new ConcatenatedCollection({collections: [folders, files]});

    files.comparator = model => -model.get('name').charCodeAt(0);
    files.sort();

    expect(items.pluck('name')).toEqual(['folder', 'b', 'a']);
  });

  it('triggers sort event when one of the collections is sorted', () => {
    var files = collection(['a', 'b'], {comparator: byName});
    var items = new ConcatenatedCollection({collections: [files]});
    var listener = jest.fn();

    items.on('sort', listener);
    files.sort();

    expect(listener).toHaveBeenCalled();
  });

  it('forwards change events of models', () => {
    var files = collection(['file']);
    var items = new ConcatenatedCollection({collections: [files]});
    var listener = jest.fn();

    items.on('change:name', listener);
    files.first().set('name', 'other');

    expect(listener).toHaveBeenCalled();
  });

  it('does not take over collection of models', () => {
    var files = collection(['file']);

    new ConcatenatedCollection({collections: [files]});

    expect(files.first().collection).toBe(files);
  });

  describe('with models of equal id in different collections', () => {
    it('contains all models', () => {
      var folders = collection(['folder']);
      var files = collection(['file']);
      folders.first().set('id', 1);
      files.first().set('id', 1);

      var items = new ConcatenatedCollection({collections: [folders, files]});

      expect(items.pluck('name')).toEqual(['folder', 'file']);
    });

    it('looks up models by model', () => {
      var folders = collection(['folder']);
      var files = collection(['file']);
      folders.first().set('id', 1);
      files.first().set('id', 1);

      var items = new ConcatenatedCollection({collections: [folders, files]});

      expect(items.get(files.first())).toBe(files.first());
    });

    it('only removes the model removed from one of the collections', () => {
      var folders = collection(['folder']);
      var files = collection(['file']);
      folders.first().set('id', 1);
      files.first().set('id', 1);
      var items = new ConcatenatedCollection({collections: [folders, files]});

      folders.remove(folders.first());

      expect(items.pluck('name')).toEqual(['file']);
    });
  });

  describe('#dispose', () => {
    it('stops listening to collections', () => {
      var files = collection(['file']);
      var items = new ConcatenatedCollection({collections: [files]});

      items.dispose();
      files.add({name: 'other'});

      expect(items.length).toBe(0);
    });
  });
});
