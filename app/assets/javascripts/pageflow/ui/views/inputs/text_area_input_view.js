/*global wysihtml5, wysihtml5ParserRules*/

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

    if (this.options.allowRichtext === undefined)
      this.options.allowRichtext = true;
    if (this.options.allowLinks === undefined)
      this.options.allowLinks = true;

    this.editor = new wysihtml5.Editor(this.ui.textarea[0], {
      toolbar: this.ui.toolbar[0],
      parserRules: {
        tags: {
          u: this.options.allowRichtext ? {} : 0,
          b: this.options.allowRichtext ? {} : 0,
          i: this.options.allowRichtext ? {} : 0,
          br: {},
          a: this.options.allowLinks ? {
            check_attributes: {
              href: "href"
            },
            set_attributes: {
              rel: "nofollow",
              target: "_blank"
            }
          } : 0
        }
      }
    });

    if (!this.options.allowRichtext) {
      this.ui.toolbar.find('a[data-wysihtml5-command="bold"]').remove();
      this.ui.toolbar.find('a[data-wysihtml5-command="italic"]').remove();
      this.ui.toolbar.find('a[data-wysihtml5-command="underline"]').remove();
    }
    if (!this.options.allowLinks) {
      this.ui.toolbar.find('a[data-wysihtml5-command="createLink"]').remove();
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
