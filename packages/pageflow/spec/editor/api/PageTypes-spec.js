describe('PageTypes', () => {
  describe('#register/#findByName', () => {
    test('allows getting a page type by name', () => {
      var pageTypes = new pageflow.PageTypes();
      pageTypes.setup([{name: 'rainbow'}]);

      var pageType = pageTypes.findByName('rainbow');

      expect(pageType.name).toBe('rainbow');
    });
  });

  describe('#register/#findByPage', () => {
    test('allows getting a page type by page', () => {
      var pageTypes = new pageflow.PageTypes();
      pageTypes.setup([{name: 'rainbow'}]);
      var page = new pageflow.Page({template: 'rainbow'});

      var pageType = pageTypes.findByPage(page);

      expect(pageType.name).toBe('rainbow');
    });
  });
});
