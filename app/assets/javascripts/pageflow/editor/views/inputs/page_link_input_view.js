pageflow.PageLinkInputView = pageflow.ReferenceInputView.extend({
  choose: function() {
    return pageflow.editor.selectPage();
  },

  getTarget: function(permaId) {
    return pageflow.pages.getByPermaId(permaId);
  }
});
