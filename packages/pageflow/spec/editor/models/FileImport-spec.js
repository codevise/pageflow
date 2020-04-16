import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import * as support from '$support';

import {FileImport, editor, authenticationProvider} from 'pageflow/editor';

describe('FileImport', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    editor.fileImporters.register('test_importer', {
      createFileImportDialogView: function(fileImport) {
        return new Marionette.ItemView({
          fileImport: fileImport
        });
      }
    });
    testContext.entry = support.factories.entry({slug: 'test_entry'});
  });


  describe('importerKey', () => {
    it('wraps registered file importer', () => {
      expect(()=>{
        new FileImport({
          importer: editor.fileImporters.find('test_importer'),
          currentEntry: testContext.entry
        });
      }).not.toThrow();
    });
  });


  describe('selectedFiles', () => {
    it('FileImport initiates an empty list of SelectedFiles', () => {
        let fileImport = new FileImport({
          importer: editor.fileImporters.find('test_importer'),
          currentEntry: testContext.entry
        });
        let selectedFiles = fileImport.get('selectedFiles');
        expect(selectedFiles).toBeDefined();
        expect(selectedFiles).toHaveLength(0);
    });

    it('only selects Backbone Model', () => {
      let fileImport = new FileImport({
        importer: editor.fileImporters.find('test_importer'),
        currentEntry: testContext.entry
      });
      let selectedFiles = fileImport.get('selectedFiles');
      let testObject = {test: 123};
      fileImport.select(testObject)
      expect(selectedFiles).not.toContain(testObject);
      testObject = new Backbone.Model(testObject);
      fileImport.select(testObject);
      expect(selectedFiles).toContain(testObject);
    });

    it('select, unselect and clearSelections method manipulate selectedFiles list', () => {
        let fileImport = new FileImport({
          importer: editor.fileImporters.find('test_importer'),
          currentEntry: testContext.entry
        });
        let selectedFiles = fileImport.get('selectedFiles');
        let testObject = new Backbone.Model({test: 123});
        fileImport.select(testObject);
        expect(selectedFiles).toContain(testObject);
        fileImport.unselect(testObject);
        expect(selectedFiles).not.toContain(testObject);
        fileImport.select(testObject);
        fileImport.clearSelections();
        expect(fileImport.get('selectedFiles')).toHaveLength(0);
    });

  });


  describe('authenticate', () => {
    support.useFakeXhr(() => testContext);

    it('FileImport initiates authentication on initialization', () => {
        jest.useFakeTimers();
        authenticationProvider.authenticate = jest.fn();
        let fileImporter = editor.fileImporters.find('test_importer');
        fileImporter.authenticationRequired = true;
        fileImporter.authenticationProvider = 'test';
        let fileImport = new FileImport({
          importer: fileImporter,
          currentEntry: testContext.entry
        });
        jest.advanceTimersByTime(4000);
        expect(authenticationProvider.authenticate).toBeCalledWith(fileImport, 'test');
    });
  });


  describe('search', () => {
    support.useFakeXhr(() => testContext);

    it('FileImport makes a request to server, to search files against given query', () => {
        let fileImport = new FileImport({
          importer: editor.fileImporters.find('test_importer'),
          currentEntry: testContext.entry
        });
        fileImport.search('test');
        expect(testContext.server.lastRequest.url).toBe('/editor/entries/test_entry/file_import/test_importer/search/?query=test');
    });
  });

   describe('get_files_meta_data', () => {
    support.useFakeXhr(() => testContext);

    it('FileImport makes a request to server, to get meta data for selected files', () => {
        let fileImport = new FileImport({
          importer: editor.fileImporters.find('test_importer'),
          currentEntry: testContext.entry
        });
        let testObject = new Backbone.Model({test: 123});
        fileImport.select(testObject);
        fileImport.getFilesMetaData()
        expect(testContext.server.lastRequest.url).toBe('/editor/entries/test_entry/file_import/test_importer/files_meta_data');
        expect(decodeURI(testContext.server.lastRequest.requestBody)).toBe('files[0][test]=123');
    });
  });





});
