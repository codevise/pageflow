/**
 * Input view to reference a page.
 *
 * @class
 * @memberof module:pageflow/editor
 */
pageflow.PageLinkInputView = pageflow.ReferenceInputView.extend({
  choose: function() {
    return pageflow.editor.selectPage({
      isAllowed: this.options.isAllowed
    });
  },

  getTarget: function(permaId) {
    return pageflow.pages.getByPermaId(permaId);
  }
});
