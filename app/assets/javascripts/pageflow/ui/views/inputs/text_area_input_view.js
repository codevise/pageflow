/*global wysihtml5*/

/**
 * Input view for multi line text with simple formatting options.
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
 * @see {@link module:pageflow/ui.pageflow.inputView pageflow.inputView} for further options
 * @class
 * @memberof module:pageflow/ui
 */
pageflow.TextAreaInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/ui/templates/inputs/text_area_input',

  ui: {
    textarea: 'textarea',
    toolbar: '.toolbar'
  },

  events: {
    'change': 'save'
  },

  onRender: function() {
    this.ui.textarea.addClass(this.options.size);
    this.load();

    this.editor = new wysihtml5.Editor(this.ui.textarea[0], {
      toolbar: this.ui.toolbar[0],
      autoLink: this.options.disableLinks ? 0 : 1,
      parserRules: {
        tags: {
          em: {unwrap: this.options.disableRichtext ? 1 : 0, rename_tag: "i"},
          strong: {unwrap: this.options.disableRichtext ? 1 : 0, rename_tag: "b"},
          u: {unwrap: this.options.disableRichtext ? 1 : 0},
          b: {unwrap: this.options.disableRichtext ? 1 : 0},
          i: {unwrap: this.options.disableRichtext ? 1 : 0},
          br: {},
          a: {
            unwrap: this.options.disableLinks ? 1 : 0,
            check_attributes: {
              href: "href"
            },
            set_attributes: {
              rel: "nofollow",
              target: "_blank"
            }
          }
        }
      }
    });

    if (this.options.disableRichtext) {
      this.ui.toolbar.find('a[data-wysihtml5-command="bold"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="italic"]').hide();
      this.ui.toolbar.find('a[data-wysihtml5-command="underline"]').hide();
    }
    if (this.options.disableLinks) {
      this.ui.toolbar.find('a[data-wysihtml5-command="createLink"]').hide();
    }

    this.editor.on('change', _.bind(this.save, this));
    this.editor.on('aftercommand:composer', _.bind(this.save, this));
  },

  save: function() {
    this.model.set(this.options.propertyName, this.editor.getValue());
  },

  load: function() {
    this.ui.textarea.val(this.model.get(this.options.propertyName));
  }
});

(function() {
  var isIE11 = navigator.userAgent.indexOf("Trident") !== -1;
  // This browser detections is copied from wysihtml5.
  var isGecko = navigator.userAgent.indexOf("Gecko") !== -1 && navigator.userAgent.indexOf("KHTML") === -1;

  wysihtml5.browser.insertsLineBreaksOnReturn = function() {
    // Used to be only isGecko. Unfortunately IE 11 is detected as
    // Gecko since it says "like Gecko" in its user agent. Make sure
    // we really are not IE 11.
    return isGecko && !isIE11;
  };
}());
