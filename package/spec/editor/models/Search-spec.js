import {FilesCollection, Search} from 'pageflow/editor';
import * as support from '$support';

describe('Search', () => {
  const f = support.factories;

  it('filters collection by attribute value', () => {
    const fileType = f.fileType();
    const files = [
      {file_name: 'some-image.png'},
      {file_name: 'other.png'}
    ];
    const entry = {};
    const collection = FilesCollection.createForFileType(fileType, files, {entry});

    const search = new Search({term: 'some'}, {attribute: 'file_name'});
    const subset = search.applyTo(collection);

    expect(subset.pluck('file_name')).toEqual(['some-image.png']);
  });

  it('updates subset when term changes', () => {
    const fileType = f.fileType();
    const files = [
      {file_name: 'some.png'},
      {file_name: 'other.png'}
    ];
    const entry = {};
    const collection = FilesCollection.createForFileType(fileType, files, {entry});

    const search = new Search({term: 'some'}, {attribute: 'file_name'});
    const subset = search.applyTo(collection);

    search.set('term', 'other');

    expect(subset.pluck('file_name')).toEqual(['other.png']);
  });

  it('sorts subset when order changes', () => {
    const fileType = f.fileType();
    const files = [
      {id: 1, file_name: 'b.png', updated_at: '2024-01-01'},
      {id: 2, file_name: 'a.png', updated_at: '2024-02-01'}
    ];
    const entry = {};
    const collection = FilesCollection.createForFileType(fileType, files, {entry});

    const search = new Search({}, {attribute: 'file_name'});
    const subset = search.applyTo(collection);

    search.set('order', 'most_recent');

    expect(subset.pluck('file_name')).toEqual(['a.png', 'b.png']);
  });

  it('sorts subset when attribute for current order changes', () => {
    const fileType = f.fileType();
    const files = [
      {id: 1, file_name: 'b.png', created_at: '2024-01-01'},
      {id: 2, file_name: 'a.png', created_at: '2024-02-01'}
    ];
    const entry = {};
    const collection = FilesCollection.createForFileType(fileType, files, {entry});

    const search = new Search({order: 'most_recent'}, {attribute: 'file_name'});
    const subset = search.applyTo(collection);

    collection.get(1).set('created_at', '2024-03-01');

    expect(subset.pluck('id')).toEqual([1, 2]);
  });

  it('stores order in local storage when changed', () => {
    const key = 'pageflow.filtered_files.sort_order.test';
    const search = new Search({}, {attribute: 'file_name', storageKey: key});

    search.set('order', 'most_recent');

    expect(localStorage.getItem(key)).toEqual('most_recent');
  });

  it('restores order from local storage', () => {
    const key = 'pageflow.filtered_files.sort_order.test';
    localStorage.setItem(key, 'most_recent');

    const search = new Search({}, {attribute: 'file_name', storageKey: key});

    expect(search.get('order')).toEqual('most_recent');
  });
});
