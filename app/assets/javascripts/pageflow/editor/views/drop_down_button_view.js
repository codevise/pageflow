/**
 * A button that displays a drop down menu on hover.
 *
 * @option label [String]
 * @options items [Backbone.Collection] The `label` attribute is used
 *   as text for the item. Items can be disabled by setting the
 *   `disabled` property to `true`. On click a `selected` method is
 *   called on the item model.
 */
pageflow.DropDownButtonView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/editor/templates/drop_down_button',
  className: 'drop_down_button',

  ui: {
    button: '> button',
    menu: '.drop_down_button_menu',
    items: '.drop_down_button_items'
  },

  events: {
    'mouseenter': function() {
      this.positionMenu();
      this.showMenu();
    },

    'mouseleave': function() {
      this.hideMenu();
    }
  },

  onRender: function() {
    var view = this;

    this.ui.button.text(this.options.label);

    this.subview(new pageflow.CollectionView({
      el: this.ui.items,
      collection: this.options.items,
      itemViewConstructor: pageflow.DropDownButtonItemView
    }));

    this.ui.menu.on({
      'mouseenter': function() {
        view.showMenu();
      },

      'mouseleave': function() {
        view.hideMenu();
      }
    });

    this.ui.menu.appendTo('#editor_menu_container');
  },

  onClose: function() {
    this.ui.menu.remove();
  },

  positionMenu: function() {
    var offset = this.$el.offset();

    this.ui.menu.css({
      top: offset.top + this.$el.height(),
      left: offset.left
    });
  },

  showMenu: function() {
    clearTimeout(this.hideMenuTimeout);
    this.ui.menu.addClass('is_visible');
  },

  hideMenu: function() {
    this.hideMenuTimeout = setTimeout(_.bind(function() {
      if (!this.isClosed) {
        this.ui.menu.removeClass('is_visible');
      }
    }, this), 500);
  }
});