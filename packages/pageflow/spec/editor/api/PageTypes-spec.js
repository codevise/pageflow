describe('PageTypes', function() {
  describe('#register/#findByName', function() {
    it('allows getting a page type by name', function() {
      var pageTypes = new pageflow.PageTypes();
      pageTypes.setup([{name: 'rainbow'}]);

      var pageType = pageTypes.findByName('rainbow');

      expect(pageType.name).to.eq('rainbow');
    });
  });

  describe('#register/#findByPage', function() {
    it('allows getting a page type by page', function() {
      var pageTypes = new pageflow.PageTypes();
      pageTypes.setup([{name: 'rainbow'}]);
      var page = new pageflow.Page({template: 'rainbow'});

      var pageType = pageTypes.findByPage(page);

      expect(pageType.name).to.eq('rainbow');
    });
  });
});
