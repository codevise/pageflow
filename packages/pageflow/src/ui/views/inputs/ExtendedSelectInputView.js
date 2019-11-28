import $ from 'jquery';
import I18n from 'i18n-js';
import _ from 'underscore';

import {SelectInputView} from './SelectInputView';

export const ExtendedSelectInputView = SelectInputView.extend({
  className: 'extended_select_input',

  initialize: function() {
    SelectInputView.prototype.initialize.apply(this, arguments);

    if (this.options.collection) {
      if (this.options.descriptionProperty) {
        this.options.descriptions = _.pluck(this.options.collection, this.options.descriptionProperty);
      }
      else if (this.options.descriptionTranslationKeyProperty) {
        this.options.descriptionTanslationKeys = _.pluck(this.options.collection, this.options.descriptionTranslationKeyProperty);
      }
    }

    if (!this.options.descriptions) {
      this.options.descriptions = _.map(this.options.descriptionTanslationKeys, function(key) {
        return I18n.t(key);
      });
    }
  },

  onRender: function() {
    var view = this,
        options = this.options;

    SelectInputView.prototype.onRender.apply(this, arguments);

    $.widget("custom.extendedselectmenu", $.ui.selectmenu, {
      _renderItem: function(ul, item) {
        var widget = this;
        var li = $('<li>', { class: item.value });
        var container = $('<div>', { class: 'text-container' }).appendTo(li);
        var index = options.values.indexOf(item.value);

        if (item.disabled) {
          li.addClass('ui-state-disabled');
        }

        if (options.pictogramClass) {
          $('<span>', {
            class: options.pictogramClass
          }).prependTo(li);
        }

        $('<p>', {
          text: item.label,
          class: 'item-text'
        }).appendTo(container);

        $('<p>', {
          text: options.descriptions[index],
          class: 'item-description'
        }).appendTo(container);

        if (options.helpLinkClicked) {
          $('<a>', {
            href: '#',
            title: I18n.t('pageflow.ui.views.extended_select_input_view.display_help'),
          })
            .on('click', function() {
              widget.close();
              options.helpLinkClicked(item.value);
              return false;
            })
            .appendTo(li);
        }

        return li.appendTo(ul);
      },

      _resizeMenu: function() {
        this.menuWrap.addClass('extended_select_input_menu');

        var menuHeight = this.menu.height(),
            menuOffset = this.button.offset().top + this.button.outerHeight(),
            bodyHeight = $('body').height();

        if (menuHeight + menuOffset > bodyHeight) {
          this.menuWrap.outerHeight(bodyHeight - menuOffset - 5).css({ 'overflow-y': 'scroll' });
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
      select: view.select.bind(view),
      width: '100%',
      position: {
        my: 'right top',
        at: 'right bottom'
      }
    });
  },

  select: function(event, ui) {
    this.ui.select.val(ui.item.value);
    this.save();
  }

});