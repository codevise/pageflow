import {FilesCollection, Page, editor} from 'pageflow/editor';

import * as support from '$support';

describe('Page', () => {
  it('initializes configuration model from configuration attribute', () => {
    const page = new Page({configuration: {some: 'value'}});

    expect(page.configuration.get('some')).toBe('value');
  });

  it('sets configuration defaults', () => {
    const page = new Page();

    expect(page.configuration.get('transition')).toBe('fade');
  });

  it('triggers change:configuration event when configuration changes', () => {
    const page = new Page({id: 5, configuration: {some: 'value'}});
    const listener = jest.fn();

    page.on('change:configuration', listener);
    page.configuration.set('some', 'other value');

    expect(listener).toHaveBeenCalledWith(page, undefined, {});
  });

  it('triggers change:title event when configuration title changes', () => {
    const page = new Page({id: 5});
    const listener = jest.fn();

    page.on('change:title', listener);
    page.configuration.set('title', 'new');

    expect(listener).toHaveBeenCalled();
  });

  it('auto saves', () => {
    const page = new Page({id: 5, configuration: {some: 'value'}});
    page.save = jest.fn();

    page.configuration.set('some', 'other value');

    expect(page.save).toHaveBeenCalled();
  });

  it('sets parent reference on configuration', () => {
    const page = new Page({id: 5, configuration: {some: 'value'}});

    expect(page.configuration.parent).toEqual(page);
  });

  it('sets page reference on configuration', () => {
    const page = new Page({id: 5, configuration: {some: 'value'}});

    expect(page.configuration.page).toEqual(page);
  });

  it('includes all attributes in data returned by toJSON', () => {
    const page = new Page({title: 'Title', configuration: {some: 'value'}});

    expect(page.toJSON()).toMatchObject({
      title: 'Title',
      configuration: {some: 'value'}
    });
  });

  describe('#thumbnailFile', () => {
    beforeAll(() => {
      editor.pageTypes.register('audio', {});
      editor.pageTypes.setup([
        {
          name: 'video',
          thumbnail_candidates: [
            {
              attribute: 'thumbnail_id',
              file_collection: 'image_files',
            },
            {
              attribute: 'image_id',
              file_collection: 'image_files',
              condition: {
                attribute: 'background_type',
                value: 'image'
              }
            },
            {
              attribute: 'poster_id',
              file_collection: 'image_files',
              condition: {
                attribute: 'background_type',
                value: 'image',
                negated: true
              }
            }
          ]
        }
      ]);
    });

    support.setupGlobals({
      entry: function() {
        editor.fileTypes = support.factories.fileTypes(function() {
          this.withImageFileType();
        });

        return support.factories.entry({}, {
          fileTypes: editor.fileTypes,
          files: FilesCollection.createForFileTypes(
            editor.fileTypes,
            {
              image_files: [
                {id: 1, perma_id: 5},
                {id: 2, perma_id: 6}
              ]
            }
          )
        });
      }
    });

    it('returns first present file', () => {
      var page = new Page({
        template: 'video',
        configuration: {
          thumbnail_id: 5
        }
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile.get('perma_id')).toBe(5);
    });

    it('returns undefined if no candidate matches', () => {
      var page = new Page({
        template: 'video',
        configuration: {}
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile).toBeUndefined();
    });

    it('returns undefined if candidate condition is not met', () => {
      var page = new Page({
        template: 'video',
        configuration: {
          image_id: 5,
          background_type: 'video'
        }
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile).toBeUndefined();
    });

    it('returns undefined if negated candidate condition is met', () => {
      var page = new Page({
        template: 'video',
        configuration: {
          poster_id: 5,
          background_type: 'image'
        }
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile).toBeUndefined();
    });

    it('returns present file if candidate condition is met', () => {
      var page = new Page({
        template: 'video',
        configuration: {
          image_id: 5,
          background_type: 'image'
        }
      });

      var thumbnailFile = page.thumbnailFile();

      expect(thumbnailFile.get('perma_id')).toBe(5);
    });

    it(
      'returns present file if negated candidate condition is not met',
      () => {
        var page = new Page({
          template: 'video',
          configuration: {
            poster_id: 5,
            background_type: 'video'
          }
        });

        var thumbnailFile = page.thumbnailFile();

        expect(thumbnailFile.get('perma_id')).toBe(5);
      }
    );
  });
});
