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
    var options = this.options;
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

        $('<span>', { class: 'type_pictogram' }).prependTo(li);

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
      }
    });

    this.ui.select.extendedselectmenu({
      width: '100%',
      position: {
        my: "right top",
        at: "right bottom"
      }
    }).extendedselectmenu("menuWidget")
      .addClass('extended-select-menu');
  }

});