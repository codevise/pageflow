import {FileFoldersCollection, FileListing, FileTypeSelection, Search} from 'pageflow/editor';

import * as support from '$support';

describe('FileListing', () => {
  const f = support.factories;

  function setup({files = {}, folders = [], ...options} = {}) {
    const fileTypes = f.fileTypes(function() {
      this.withImageFileType();
      this.withVideoFileType();
      this.withTextTrackFileType();
    });
    const entry = f.entry({}, {fileTypes, filesAttributes: files});
    const fileFolders = new FileFoldersCollection(folders);

    const collections = ['image_files', 'video_files'].map(name =>
      entry.getFileCollection(fileTypes.findByCollectionName(name))
    );

    return {
      entry,
      fileFolders,
      createListing: (attributes, listingOptions) =>
        new FileListing(attributes, {collections, fileFolders, ...options, ...listingOptions})
    };
  }

  function names(collection) {
    return collection.map(model =>
      model.get('name') || model.get('file_name') || model.get('display_name')
    );
  }

  it('lists files of all collections', () => {
    const {createListing} = setup({
      files: {
        image_files: [{id: 1, file_name: 'a.png'}],
        video_files: [{id: 2, file_name: 'b.mp4'}]
      }
    });

    const listing = createListing();

    expect(names(listing.listItems)).toEqual(['a.png', 'b.mp4']);
  });

  it('lists folders before files', () => {
    const {createListing} = setup({
      files: {image_files: [{id: 1, file_name: 'a.png'}]},
      folders: [{id: 1, perma_id: 10, name: 'Photos'}]
    });

    const listing = createListing();

    expect(names(listing.listItems)).toEqual(['Photos', 'a.png']);
  });

  describe('with file type selection', () => {
    it('lists files of selected file types', () => {
      const fileTypeSelection = new FileTypeSelection({collectionNames: ['video_files']});
      const {createListing} = setup({
        files: {
          image_files: [{id: 1, file_name: 'a.png'}],
          video_files: [{id: 2, file_name: 'b.mp4'}]
        },
        fileTypeSelection
      });

      const listing = createListing();

      expect(names(listing.listItems)).toEqual(['b.mp4']);
    });

    it('updates when selection changes', () => {
      const fileTypeSelection = new FileTypeSelection();
      const {createListing} = setup({
        files: {
          image_files: [{id: 1, file_name: 'a.png'}],
          video_files: [{id: 2, file_name: 'b.mp4'}]
        },
        fileTypeSelection
      });

      const listing = createListing();
      fileTypeSelection.select(['image_files']);

      expect(names(listing.listItems)).toEqual(['a.png']);
    });

    it('hides folders without files of selected types', () => {
      const fileTypeSelection = new FileTypeSelection({collectionNames: ['video_files']});
      const {createListing} = setup({
        files: {image_files: [{id: 1, file_name: 'a.png', folder_perma_id: 10}]},
        folders: [{id: 1, perma_id: 10, name: 'Photos'}],
        fileTypeSelection
      });

      const listing = createListing();

      expect(names(listing.listItems)).toEqual([]);
    });

    it('keeps folders with files of selected types in subfolders', () => {
      const fileTypeSelection = new FileTypeSelection({collectionNames: ['image_files']});
      const {createListing} = setup({
        files: {image_files: [{id: 1, file_name: 'a.png', folder_perma_id: 11}]},
        folders: [
          {id: 1, perma_id: 10, name: 'Photos'},
          {id: 2, perma_id: 11, name: 'Holidays', parent_folder_perma_id: 10}
        ],
        fileTypeSelection
      });

      const listing = createListing();

      expect(names(listing.listItems)).toEqual(['Photos']);
    });

    describe('with ignoreAbsentFileTypes option', () => {
      it('lists all files if no files of selected types are present', () => {
        const fileTypeSelection = new FileTypeSelection({collectionNames: ['video_files']});
        const {createListing} = setup({
          files: {image_files: [{id: 1, file_name: 'a.png'}]},
          fileTypeSelection,
          ignoreAbsentFileTypes: true
        });

        const listing = createListing();

        expect(names(listing.listItems)).toEqual(['a.png']);
      });

      it('applies selection once files of selected types are present', () => {
        const fileTypeSelection = new FileTypeSelection({collectionNames: ['video_files']});
        const {entry, createListing} = setup({
          files: {image_files: [{id: 1, file_name: 'a.png'}]},
          fileTypeSelection,
          ignoreAbsentFileTypes: true
        });

        const listing = createListing();
        const videoFiles = entry.getFileCollection('video_files');
        videoFiles.add({id: 2, file_name: 'b.mp4'}, {fileType: videoFiles.fileType});
        listing.updateFileTypeFilter();

        expect(names(listing.listItems)).toEqual(['b.mp4']);
      });
    });
  });

  describe('folders', () => {
    it('lists only files and subfolders of folder', () => {
      const {fileFolders, createListing} = setup({
        files: {
          image_files: [
            {id: 1, file_name: 'top.png'},
            {id: 2, file_name: 'nested.png', folder_perma_id: 10}
          ]
        },
        folders: [
          {id: 1, perma_id: 10, name: 'Photos'},
          {id: 2, perma_id: 11, name: 'Holidays', parent_folder_perma_id: 10}
        ]
      });

      const listing = createListing({folder: fileFolders.byPermaId(10)});

      expect(names(listing.listItems)).toEqual(['Holidays', 'nested.png']);
    });

    it('updates when folder changes', () => {
      const {fileFolders, createListing} = setup({
        files: {
          image_files: [
            {id: 1, file_name: 'top.png'},
            {id: 2, file_name: 'nested.png', folder_perma_id: 10}
          ]
        },
        folders: [{id: 1, perma_id: 10, name: 'Photos'}]
      });

      const listing = createListing();
      listing.set('folder', fileFolders.byPermaId(10));

      expect(names(listing.listItems)).toEqual(['nested.png']);
    });

    it('lists empty folders by default', () => {
      const {createListing} = setup({
        folders: [{id: 1, perma_id: 10, name: 'Empty'}]
      });

      const listing = createListing();

      expect(names(listing.listItems)).toEqual(['Empty']);
    });

    it('supports hiding empty folders', () => {
      const {createListing} = setup({
        files: {image_files: [{id: 1, file_name: 'a.png', folder_perma_id: 11}]},
        folders: [
          {id: 1, perma_id: 10, name: 'Empty'},
          {id: 2, perma_id: 11, name: 'Photos'}
        ],
        hideEmptyFolders: true
      });

      const listing = createListing();

      expect(names(listing.listItems)).toEqual(['Photos']);
    });

    it('lists folders once files are added to them', () => {
      const {entry, createListing} = setup({
        folders: [{id: 1, perma_id: 10, name: 'Photos'}],
        hideEmptyFolders: true
      });

      const listing = createListing();
      entry.getFileCollection('image_files').add({id: 1, file_name: 'a.png', folder_perma_id: 10});

      expect(names(listing.listItems)).toEqual(['Photos']);
    });
  });

  describe('with search', () => {
    function search(term) {
      return new Search({term}, {attribute: 'display_name'});
    }

    it('searches files of all folders at top level', () => {
      const {createListing} = setup({
        files: {
          image_files: [
            {id: 1, display_name: 'tree.png'},
            {id: 2, display_name: 'nested tree.png', folder_perma_id: 10},
            {id: 3, display_name: 'house.png'}
          ]
        },
        folders: [{id: 1, perma_id: 10, name: 'Photos'}],
        search: search('tree')
      });

      const listing = createListing();

      expect(listing.listItems.pluck('display_name')).toEqual(['nested tree.png', 'tree.png']);
    });

    it('lists folders matching search term at top level', () => {
      const {createListing} = setup({
        folders: [
          {id: 1, perma_id: 10, name: 'Trees'},
          {id: 2, perma_id: 11, name: 'Houses'}
        ],
        search: search('tree')
      });

      const listing = createListing();

      expect(names(listing.listItems)).toEqual(['Trees']);
    });

    it('searches only files of folder inside folder', () => {
      const {fileFolders, createListing} = setup({
        files: {
          image_files: [
            {id: 1, display_name: 'tree.png'},
            {id: 2, display_name: 'nested tree.png', folder_perma_id: 10}
          ]
        },
        folders: [
          {id: 1, perma_id: 10, name: 'Photos'},
          {id: 2, perma_id: 11, name: 'Trees', parent_folder_perma_id: 10}
        ],
        search: search('tree')
      });

      const listing = createListing({folder: fileFolders.byPermaId(10)});

      expect(names(listing.listItems)).toEqual(['nested tree.png']);
    });
  });

  it('stops updating once disposed', () => {
    const {entry, createListing} = setup();

    const listing = createListing();
    listing.dispose();
    entry.getFileCollection('image_files').add({id: 1, file_name: 'a.png'});

    expect(listing.listItems.length).toBe(0);
  });
});
