// Mixin for item views of a list which can be navigated with arrow keys
// while the search field has focus. Views need to provide a `select`
// method for what pressing enter shall do.
export const listHighlighting = {
  initialize: function() {
    if (!this.options.listHighlight) {
      return;
    }

    this.listenTo(this.options.listHighlight, 'change:currentCid change:active', () => {
      if (this.updateHighlight()) {
        this.el.scrollIntoView({block: 'nearest', behavior: 'smooth'});
      }
    });

    this.listenTo(this.options.listHighlight, 'selected:' + this.model.cid, this.select);
  },

  onRender: function() {
    this.updateHighlight();
  },

  updateHighlight: function() {
    if (!this.options.listHighlight) {
      return false;
    }

    var highlighted = this.options.listHighlight.get('currentCid') === this.model.cid &&
                      this.options.listHighlight.get('active');

    this.$el.toggleClass('keyboard_highlight', highlighted);
    this.$el.attr('aria-selected', highlighted ? 'true' : null);

    return highlighted;
  }
};
