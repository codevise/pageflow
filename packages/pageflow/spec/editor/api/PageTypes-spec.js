import {PageTypes, Page} from '$pageflow/editor';

import template from '../rainbow.jst';

describe('PageTypes', () => {
  describe('#register/#findByName', () => {
    test('allows getting a page type by name', () => {
      var pageTypes = new PageTypes();
      pageTypes.setup([{name: 'rainbow'}]);

      var pageType = pageTypes.findByName('rainbow');

      expect(pageType.name).toBe('rainbow');
    });
  });

  describe('#register/#findByPage', () => {
    test('allows getting a page type by page', () => {
      var pageTypes = new PageTypes();
      pageTypes.setup([{name: 'rainbow'}]);
      var page = new Page({template});

      var pageType = pageTypes.findByPage(page);

      expect(pageType.name).toBe('rainbow');
    });
  });
});
