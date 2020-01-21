import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {inputView} from 'pageflow/ui';

import {ModelThumbnailView} from '../ModelThumbnailView';

import template from '../../templates/inputs/reference.jst';

/**
 * Base class for input views that reference models.
 *
 * @class
 */
export const ReferenceInputView = Marionette.ItemView.extend(
/** @lends ReferenceInputView.prototype */{

  mixins: [inputView],

  template,
  className: 'reference_input',

  ui: {
    title: '.title',
    chooseButton: '.choose',
    unsetButton: '.unset',
    buttons: 'button'
  },

  events: {
    'click .choose': function() {
      var view = this;

      this.chooseValue().then(function(id) {
        view.model.set(view.options.propertyName, id);
      });

      return false;
    },

    'click .unset': function() {
      this.model.unset(this.options.propertyName);
      return false;
    }
  },

  initialize: function() {
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);
  },

  onRender: function() {
    this.update();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.update);
  },

  /**
   * Returns a promise for some identifying attribute.
   *
   * Default attribute name is perma_id. If the attribute is named
   * differently, you can have your specific ReferenceInputView
   * implement `chooseValue()` accordingly.
   *
   * Will be used to set the chosen Model for this View.
   */
  chooseValue: function() {
    return this.choose().then(function(model) {
      return model.get('perma_id');
    });
  },

  choose: function() {
    throw 'Not implemented: Override ReferenceInputView#choose to return a promise';
  },

  getTarget: function(targetId) {
    throw 'Not implemented: Override ReferenceInputView#getTarget';
  },

  createThumbnailView: function(target) {
    return new ModelThumbnailView({
      model: target
    });
  },

  update: function() {
    if (this.isClosed) {
      return;
    }

    var target = this.getTarget(this.model.get(this.options.propertyName));

    this.ui.title.text(target ? target.title() : I18n.t('pageflow.editor.views.inputs.reference_input_view.none'));

    this.ui.unsetButton.toggle(!!target && !this.options.hideUnsetButton);
    this.ui.unsetButton.attr(
      'title',
      this.options.unsetButtonTitle ||
        I18n.t('pageflow.editor.views.inputs.reference_input_view.unset')
    );

    this.ui.chooseButton.attr(
      'title',
      this.options.chooseButtonTitle ||
        I18n.t('pageflow.editor.views.inputs.reference_input_view.choose')
    );

    this.updateDisabledAttribute(this.ui.buttons);

    if (this.thumbnailView) {
      this.thumbnailView.close();
    }

    this.thumbnailView = this.subview(this.createThumbnailView(target));

    this.ui.title.before(this.thumbnailView.el);
  }
});
