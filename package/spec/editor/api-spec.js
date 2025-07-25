import Backbone from 'backbone';

import {EditorApi} from 'pageflow/editor';
import {state} from '$state';

describe('pageflow.EditorApi', () => {
  describe('#selectFile', () => {
    it('navigates to files route for file type given as string', () => {
      var router = fakeRouter();
      var api = new EditorApi({router: router});

      api.selectFile('image_files', 'some_handler');

      expect(router.navigate).toHaveBeenCalledWith(
        expect.stringContaining('/files/image_files?handler=some_handler'),
        {trigger: true}
      );
    });

    it('navigates to files route for file type given as object', () => {
      var router = fakeRouter();
      var api = new EditorApi({router: router});

      api.selectFile({name: 'image_files', filter: 'large'}, 'some_handler');

      expect(router.navigate).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp('/files/image_files\\?handler=some_handler.*filter=large')),
        {trigger: true}
      );
    });

    it('navigates to files route without collection name for file type given as empty object', () => {
      var router = fakeRouter();
      var api = new EditorApi({router: router});

      api.selectFile({defaultTab: 'image_files'}, 'some_handler');

      expect(router.navigate).toHaveBeenCalledWith(
        expect.stringContaining('/files/image_files:default?handler=some_handler'),
        {trigger: true}
      );
    });

    it('passes payload as serialized string', () => {
      var router = fakeRouter();
      var api = new EditorApi({router: router});

      api.selectFile('image_files', 'some_handler', {some: 'payload'});

      expect(router.navigate).toHaveBeenCalledWith(
        expect.stringContaining('payload=%7B%22some%22%3A%22payload%22%7D'),
        {trigger: true}
      );
    });

    function fakeRouter() {
      return {navigate: jest.fn()};
    }
  });

  describe('#createEntryModel', () => {
    it('creates model registered as entry model of the entry type', () => {
      var api = new EditorApi();
      var EntryModel = Backbone.Model.extend();

      api.registerEntryType('test', {
        entryModel: EntryModel
      });
      var entry = api.createEntryModel({});

      expect(entry).toBeInstanceOf(EntryModel);
    });

    it('passes entry attributes from seed data', () => {
      var api = new EditorApi();
      var EntryModel = Backbone.Model.extend();
      var seed = {
        entry: {title: 'Some title'}
      };

      api.registerEntryType('test', {
        entryModel: EntryModel
      });
      var entry = api.createEntryModel(seed);

      expect(entry.get('title')).toBe('Some title');
    });

    it('passes options to entry', () => {
      var api = new EditorApi();
      var EntryModel = Backbone.Model.extend({
        initialize(attributes, options) {
          this.someOption = options.someOption;
        }
      });

      api.registerEntryType('test', {
        entryModel: EntryModel
      });
      var entry = api.createEntryModel({}, {someOption: true});

      expect(entry.someOption).toBe(true);
    });

    it('invokes setupFromEntryTypeSeed with entry type seed data', () => {
      var api = new EditorApi();
      var EntryModel = Backbone.Model.extend({
        setupFromEntryTypeSeed(seed) {
          this.sections = seed.sections;
        }
      });
      var seed = {
        entry_type: {sections: []}
      }

      api.registerEntryType('test', {
        entryModel: EntryModel
      });
      var entry = api.createEntryModel(seed);

      expect(entry.sections).toEqual([]);
    });

    it('passes state as second param setupFromEntryTypeSeed for legacy integration', () => {
      var api = new EditorApi();
      var EntryModel = Backbone.Model.extend({
        setupFromEntryTypeSeed: jest.fn()
      });

      api.registerEntryType('test', {
        entryModel: EntryModel
      });
      var entry = api.createEntryModel({});

      expect(entry.setupFromEntryTypeSeed).toHaveBeenCalledWith(undefined, state);
    });
  });

  describe('#ensureBrowserSupport', () => {
    it('expects to start the editor for only latest browsers', () => {
      var api = new EditorApi();
      var EntryModel = Backbone.Model.extend();
      var BrowserNotSupportedView = Backbone.View.extend();
      var start = jest.fn();

      api.registerEntryType('test', {
        entryMode: EntryModel,
        isBrowserSupported() {
            return true
        },
        browserNotSupportedView: BrowserNotSupportedView
      });

      api.ensureBrowserSupport(start);

      expect(start).toBeCalled();
    });

    it('expects to block the editor for old browsers and mobile devices', () => {
      var api = new EditorApi();
      var EntryModel = Backbone.Model.extend();
      var BrowserNotSupportedView = Backbone.View.extend();
      var start = jest.fn();

      api.registerEntryType('test', {
        entryMode: EntryModel,
        isBrowserSupported() {
            return false
        },
        browserNotSupportedView: BrowserNotSupportedView
      });

      api.ensureBrowserSupport(start);

      expect(start).not.toBeCalled();
    });
  });
});
