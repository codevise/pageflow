import Backbone from 'backbone';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';
import wysihtml5 from 'wysihtml5';

import {inputView} from '../mixins/inputView';
import {inputWithPlaceholderText} from '../mixins/inputWithPlaceholderText';

import template from '../../templates/inputs/textAreaInput.jst';

/**
 * Input view for multi line text with simple formatting options.
 * See {@link inputWithPlaceholderText} for placeholder related options.
 * See {@link inputView} for further options.
 *
 * @param {Object} [options]
 *
 * @param {string} [options.size="normal"]
 *   Pass `"short"` to reduce the text area height.
 *
 * @param {boolean} [options.disableLinks=false]
 *   Do not allow links inside the text.
 *
 * @param {boolean} [options.disableRichtext=false]
 *   Do not provide text formatting options.
 *
 * @param {Backbone.View} [options.fragmentLinkInputView]
 *   A view to select an id to use in links which only consist
 *   of a url fragment. Will receive a model with a `linkId`
 *   attribute.
 *
 * @class
 */
export const TextAreaInputView = Marionette.ItemView.extend({
  mixins: [inputView, inputWithPlaceholderText],

  template,

  ui: {
    input: 'textarea',
    toolbar: '.toolbar',

    linkButton: '.link_button',
    linkDialog: '.link_dialog',

    urlInput: '.current_url',
    targetInput: '.current_target',

    linkTypeSelection: '.link_type_select',
    urlLinkRadioButton: '.url_link_radio_button',
    fragmentLinkRadioButton: '.fragment_link_radio_button',

    urlLinkPanel: '.url_link_panel',
    displayUrlInput: '.display_url',
    openInNewTabCheckBox: '.open_in_new_tab',

    fragmentLinkPanel: '.fragment_link_panel',
  },

  events: {
    'change textarea': 'save',

    'click .url_link_radio_button': 'showUrlLinkPanel',
    'click .fragment_link_radio_button': 'showFragmentLinkPanel',

    'change .open_in_new_tab': 'setTargetFromOpenInNewTabCheckBox',
    'change .display_url': 'setUrlFromDisplayUrl'
  },

  onRender: function() {
    this.ui.input.addClass(this.options.size);
    this.load();
    this.updatePlaceholder();

    this.editor = new wysihtml5.Editor(this.ui.input[0], {
      toolbar: this.ui.toolbar[0],
      autoLink: this.options.disableLinks ? 0 : 1,
      parserRules: {
        tags: {
          em: {unwrap: this.options.disableRichtext ? 1 : 0, rename_tag: "i"},
          strong: {unwrap: this.options.disableRichtext ? 1 : 0, rename_tag: "b"},
          u: {unwrap: this.options.disableRichtext ? 1 : 0},
          b: {unwrap: this.options.disableRichtext ? 1 : 0},
          i: {unwrap: this.options.disableRichtext ? 1 : 0},
          ol: {unwrap: this.options.enableLists ? 0 : 1},
          ul: {unwrap: this.options.enableLists ? 0 : 1},
          li: {unwrap: this.options.enableLists ? 0 : 1},
          br: {},
          a: {
            unwrap: this.options.disableLinks ? 1 : 0,
            check_attributes: {
              href: 'href',
              target: 'any'
            },
            set_attributes: {
              rel: 'nofollow'
            }
          }
        }
      }
    });

    if (this.options.disableRichtext) {
      this.ui.toolbar.find('a[data-wysihtml5-command="bold"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="italic"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="underline"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="insertOrderedList"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="insertUnorderedList"]').hide();
    }

    if (!this.options.enableLists) {
      this.ui.toolbar.find('a[data-wysihtml5-command="insertOrderedList"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="insertUnorderedList"]').hide();
    }

    if (this.options.disableLinks) {
      this.ui.toolbar.find('a[data-wysihtml5-command="createLink"]').hide();
    }
    else {
      this.setupUrlLinkPanel();
      this.setupFragmentLinkPanel();
    }

    this.editor.on('change', _.bind(this.save, this));
    this.editor.on('aftercommand:composer', _.bind(this.save, this));
  },

  onClose: function() {
    this.editor.fire('destroy:composer');
  },

  save: function() {
    this.model.set(this.options.propertyName, this.editor.getValue());
  },

  load: function() {
    this.ui.input.val(this.model.get(this.options.propertyName));
  },

  setupUrlLinkPanel: function() {
    this.editor.on('show:dialog', _.bind(function() {
      this.ui.linkDialog.toggleClass('for_existing_link',
                                     this.ui.linkButton.hasClass('wysihtml5-command-active'));

      var currentUrl = this.ui.urlInput.val();

      if (currentUrl.startsWith('#')) {
        this.ui.displayUrlInput.val('');
        this.ui.openInNewTabCheckBox.prop('checked', true);
      }
      else {
        this.ui.displayUrlInput.val(currentUrl);
        this.ui.openInNewTabCheckBox.prop('checked', this.ui.targetInput.val() !== '_self');
      }
    }, this));
  },

  setupFragmentLinkPanel: function() {
    if (this.options.fragmentLinkInputView) {
      this.fragmentLinkModel = new Backbone.Model();

      this.listenTo(this.fragmentLinkModel, 'change', function(model, options) {
        if (!options.skipCurrentUrlUpdate) {
          this.setInputsFromFragmentLinkModel();
        }
      });

      this.editor.on('show:dialog', _.bind(function() {
        var currentUrl = this.ui.urlInput.val();
        var id = currentUrl.startsWith('#') ? currentUrl.substr(1) : null;

        this.fragmentLinkModel.set('linkId', id, {skipCurrentUrlUpdate: true});
        this.initLinkTypePanels(!id);
      }, this));

      var fragmentLinkInput = new this.options.fragmentLinkInputView({
        model: this.fragmentLinkModel,
        propertyName: 'linkId',
        label: I18n.t('pageflow.ui.templates.inputs.text_area_input.target'),
        hideUnsetButton: true
      });

      this.ui.fragmentLinkPanel.append(fragmentLinkInput.render().el);
    }
    else {
      this.ui.linkTypeSelection.hide();
      this.ui.fragmentLinkPanel.hide();
    }
  },

  initLinkTypePanels: function(isUrlLink) {
    if (isUrlLink) {
      this.ui.urlLinkRadioButton.prop('checked', true);
    }
    else {
      this.ui.fragmentLinkRadioButton.prop('checked', true);
    }

    this.ui.toolbar.toggleClass('fragment_link_panel_active', !isUrlLink);
  },

  showUrlLinkPanel: function() {
    this.ui.toolbar.removeClass('fragment_link_panel_active');
    this.setUrlFromDisplayUrl();
    this.setTargetFromOpenInNewTabCheckBox();
  },

  showFragmentLinkPanel: function() {
    this.ui.toolbar.addClass('fragment_link_panel_active');
    this.setInputsFromFragmentLinkModel();
  },

  setInputsFromFragmentLinkModel: function() {
    this.ui.urlInput.val('#' + (this.fragmentLinkModel.get('linkId') || ''));
    this.ui.targetInput.val('_self');
  },

  setUrlFromDisplayUrl: function() {
    this.ui.urlInput.val(this.ui.displayUrlInput.val());
  },

  setTargetFromOpenInNewTabCheckBox: function() {
    this.ui.targetInput.val(this.ui.openInNewTabCheckBox.is(':checked') ? '_blank' : '_self');
  }
});
