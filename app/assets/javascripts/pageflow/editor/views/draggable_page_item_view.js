pageflow.DraggablePageItemView = pageflow.PageItemView.extend({
  className: 'draggable',

  events: {
    'mouseenter': function() {
      this.model.set('highlighted', true);
    },

    'mouseleave': function() {
      this.model.unset('highlighted');
    }
  },

  onRender: function() {
    var view = this;

    this.$el.draggable({
      helper: function() {
        return view.$el
          .clone()
          .width(view.$el.width())
          .wrap('<div class="editor"><ul class="dragged pages outline" /></div>')
          .parents('.editor')
          .css('z-index', 100);
      },
      appendTo: 'body'
    });

    pageflow.PageItemView.prototype.onRender.call(this);
  }
});