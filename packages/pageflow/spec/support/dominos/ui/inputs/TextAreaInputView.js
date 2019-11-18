import _ from 'underscore';
import wysihtml5 from 'wysihtml5';

import {Base} from '../../Base';

export const TextAreaInputView = Base.extend({
  selectFirstLink: function(callback) {
    var iframe = this.$el.find('iframe');

    this._ensureEditorLoadsContent(function() {
      var link = iframe.contents().find('a').first();

      this._selectElement(iframe, link);
      this._simulateUserInteractionToTriggerDialog();
      callback();
    });
  },

  selectAll: function(callback) {
    var iframe = this.$el.find('iframe');

    this._ensureEditorLoadsContent(function() {
      this._selectElement(iframe, iframe.contents().find('body'));
      callback();
    });
  },

  clickLinkButton: function() {
    this._click('[data-wysihtml5-command=createLink]');
  },

  clickRemoveLink: function() {
    this._click('[data-wysihtml5-command=removeLink]');
  },

  clickUrlLinkRadioButton: function() {
    this._click('.url_link_radio_button');
  },

  clickFragmentLinkRadioButton: function() {
    this._click('.fragment_link_radio_button');
  },

  enterLinkUrl: function(url) {
    this.$el.find('.display_url').val(url).trigger('change');
  },

  toggleOpenInNewTab: function(value) {
    this.$el.find('.open_in_new_tab').prop('checked', value).trigger('change');
  },

  clickSaveInLinkDialog: function() {
    this._click('[data-wysihtml5-dialog-action=save]');
  },

  _click: function(selector) {
    // Use HTMLElement#click instead of jQuery#click to ensure non-jQuery
    // event handlers trigger correctly.
    this.$el.find(selector)[0].click();
  },

  _ensureEditorLoadsContent: function(callback) {
    setTimeout(_.bind(callback, this), 1);
  },

  _selectElement: function(iframe, el) {
    var iframeDocument = iframe.contents()[0];

    var range = iframeDocument.createRange();
    range.setStart(el[0], 0);
    range.setEnd(el[0], 1);

    var selection = iframeDocument.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  },

  _simulateUserInteractionToTriggerDialog: function() {
    this.$el.find('iframe').click();
  }
});
