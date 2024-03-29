import {ChaptersCollection, Chapter, FilesCollection, PagesCollection, Page, StorylinesCollection, Storyline, ThemesCollection} from 'pageflow/editor';
import {PreviewEntryData} from 'pageflow-paged/editor'
import * as support from '$support';

describe('pageflow.PreviewEntryData', () => {
  describe('#getSiteOption', () => {
    it('returns option value by name', () => {
      var entry = support.factories.entry(
        {
          metadata: {theme_name: 'custom'}
        },
        {
          themes: new ThemesCollection([
            {
              name: 'custom',
              page_change_by_scrolling: true
            }
          ])
        }
      );
      var entryData = new PreviewEntryData({
        entry: entry
      });

      var result = entryData.getSiteOption('page_change_by_scrolling');

      expect(result).toBe(true);
    });
  });

  describe('#getFile', () => {
    it(
      'returns file attributes by collection name and file perma_id',
      () => {
        var entry = support.factories.entry({}, {
          fileTypes: support.factories.fileTypesWithImageFileType(),
          files: {
            image_files: FilesCollection.createForFileType(
              support.factories.imageFileType(),
              [
                {
                  id: 1,
                  perma_id: 1,
                  url: 'image.png'
                }
              ]
            )
          }
        });
        var entryData = new PreviewEntryData({
          entry: entry
        });

        var result = entryData.getFile('image_files', 1);

        expect(result.url).toBe('image.png');
      }
    );
  });

  describe('#getStorylineConfiguration', () => {
    it('returns configuration by storyline id', () => {
      var configuration = {title: 'some text'};
      var storyline = new Storyline({id: 1, configuration: configuration}, {
        chapters: new ChaptersCollection([])
      });
      var entryData = new PreviewEntryData({
        storylines: new StorylinesCollection([storyline])
      });

      var result = entryData.getStorylineConfiguration(1);

      expect(result.title).toBe('some text');
    });
  });

  describe('#getChapterConfiguration', () => {
    it('returns configuration by chapter id', () => {
      var configuration = {title: 'some text'};
      var chapter = new Chapter({id: 1, configuration: configuration}, {
        pages: new PagesCollection([])
      });
      var entryData = new PreviewEntryData({
        chapters: new ChaptersCollection([chapter])
      });

      var result = entryData.getChapterConfiguration(1);

      expect(result.title).toBe('some text');
    });
  });

  describe('#getChapterPosition', () => {
    it('returns index of chapter in chapters collection ', () => {
      var entryData = new PreviewEntryData({
        chapters: new ChaptersCollection([
          new Chapter({id: 1}, {pages: new PagesCollection()}),
          new Chapter({id: 2}, {pages: new PagesCollection()})
        ])
      });

      expect(entryData.getChapterPosition(1)).toEqual(0);
      expect(entryData.getChapterPosition(2)).toEqual(1);
    });
  });

  describe('#getChapterPagePermaIds', () => {
    it('returns perma ids of pages of chapter by chapter id', () => {
      var chapter = new Chapter({id: 1}, {
        pages: new PagesCollection([
          {id: 1, chapter_id: 1, perma_id: 100},
          {id: 2, chapter_id: 1, perma_id: 101}
        ])
      });
      var entryData = new PreviewEntryData({
        chapters: new ChaptersCollection([chapter])
      });

      var result = entryData.getChapterPagePermaIds(1);

      expect(result).toEqual([100, 101]);
    });
  });

  describe('#getPageConfiguration', () => {
    it('returns configruation by page perma id', () => {
      var configuration = {title: 'some text'};
      var page = new Page({perma_id: 100, configuration: configuration});
      var entryData = new PreviewEntryData({
        pages: new PagesCollection([page])
      });

      var result = entryData.getPageConfiguration(100);

      expect(result.title).toBe('some text');
    });
  });

  describe('#getPagePosition', () => {
    it('returns configruation by page perma id', () => {
      var page1 = new Page({perma_id: 100});
      var page2 = new Page({perma_id: 101});
      var entryData = new PreviewEntryData({
        pages: new PagesCollection([page1, page2])
      });

      expect(entryData.getPagePosition(100)).toBe(0);
      expect(entryData.getPagePosition(101)).toBe(1);
    });
  });

  describe('#getChapterIdByPagePermaId', () => {
    it('returns id of pages parent chapter ', () => {
      var page = new Page({perma_id: 102, chapter_id: 2});
      var entryData = new PreviewEntryData({
        pages: new PagesCollection([page])
      });

      var result = entryData.getChapterIdByPagePermaId(102);

      expect(result).toBe(2);
    });
  });

  describe('#getStorylineIdByChapterId', () => {
    it('returns id of chapter`s parent storyline', () => {
      var chapter = new Chapter({id: 102, storyline_id: 2}, {
        pages: new PagesCollection([])
      });
      var entryData = new PreviewEntryData({
        chapters: new ChaptersCollection([chapter])
      });

      var result = entryData.getStorylineIdByChapterId(102);

      expect(result).toBe(2);
    });
  });
});
