import {Page} from '$pageflow/editor';
import {PageTypes} from '$pageflow/editor/api/PageTypes';


describe('PageTypes', () => {
  describe('#register/#findByName', () => {
    it('allows getting a page type by name', () => {
      var pageTypes = new PageTypes();
      pageTypes.setup([{name: 'rainbow'}]);

      var pageType = pageTypes.findByName('rainbow');

      expect(pageType.name).toBe('rainbow');
    });
  });

  describe('#register/#findByPage', () => {
    it('allows getting a page type by page', () => {
      var pageTypes = new PageTypes();
      pageTypes.setup([{name: 'rainbow'}]);
      var page = new Page({template: 'rainbow'});

      var pageType = pageTypes.findByPage(page);

      expect(pageType.name).toBe('rainbow');
    });
  });
});
