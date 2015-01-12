pageflow.ExtendedSelectInputView = pageflow.SelectInputView.extend({
  initialize: function() {
    pageflow.SelectInputView.prototype.initialize.apply(this, arguments);

    if (this.options.collection) {
      this.options.helpLinks = _.pluck(this.options.collection, this.options.helpLinkProperty);

      if (this.options.descriptionProperty) {
        this.options.descriptions = _.pluck(this.options.collection, this.options.descriptionProperty);
      }
      else if (this.options.descriptionTranslationKeyProperty) {
        this.options.descriptionTanslationKeys = _.pluck(this.options.collection, this.options.descriptionTranslationKeyProperty);
      }

      if (this.options.helpLinkProperty) {
        this.options.helpLinks = _.pluck(this.options.collection, this.options.helpLinkProperty);
      }
    }

    if (!this.options.descriptions) {
      this.options.descriptions = _.map(this.options.descriptionTanslationKeys, function(key) {
        return I18n.t(key);
      });
    }
  },

  onRender: function() {
    var that = this,
        options = this.options;
    pageflow.SelectInputView.prototype.onRender.apply(this, arguments);

    $.widget("custom.extendedselectmenu", $.ui.selectmenu, {
      _renderItem: function(ul, item) {
        var li = $('<li>', { class: item.value });
        var container = $('<div>', { class: 'text-container' }).appendTo(li);
        var index = options.values.indexOf(item.value);
        var helpLink = options.helpLinks[index];

        if (item.disabled) {
          li.addClass('ui-state-disabled');
        }

        $('<span>', { class: options.pictogramClassProperty }).prependTo(li);

        $('<p>', {
          text: item.label,
          class: 'item-text'
        }).appendTo(container);
        $('<p>', {
          text: options.descriptions[index],
          class: 'item-description'
        }).appendTo(container);

        if (helpLink) {
          $('<a>', { href: helpLink }).appendTo(li);
        }

        return li.appendTo(ul);
      },

      _resizeMenu: function() {
        var menuHeight = this.menu.height(),
            menuOffset = this.button.offset().top + this.button.outerHeight(),
            bodyHeight = $("body").height();

        if (menuHeight + menuOffset > bodyHeight) {
          this.menuWrap.outerHeight(bodyHeight - menuOffset).css({ 'overflow-y': 'scroll' });
        }
        else {
          this.menuWrap.css({
            height: 'initial',
            'overflow-y': 'initial'
          });
        }
      }
    });

    this.ui.select.extendedselectmenu({
      select: that.select.bind(that),
      width: '100%',
      position: {
        my: "right top",
        at: "right bottom"
      }
    }).extendedselectmenu("menuWidget")
      .addClass('extended-select-menu');
  },

  select: function(event, ui) {
    this.ui.select.val(ui.item.value);
    this.save();
  }

});