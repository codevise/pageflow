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
 * @see
 * {@link module:pageflow/ui.pageflow.inputWithPlaceholderText pageflow.inputWithPlaceholderText}
 * for placeholder related options
 *
 * @see {@link module:pageflow/ui.pageflow.inputView pageflow.inputView} for further options
 * @class
 * @memberof module:pageflow/ui
 */
pageflow.TextAreaInputView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView, pageflow.inputWithPlaceholderText],

  template: 'pageflow/ui/templates/inputs/text_area_input',

  ui: {
    input: 'textarea',
    toolbar: '.toolbar',
    urlInput: '.toolbar .dialog input.current_url',
    urlRadioButton: '.toolbar .dialog .link_type_select input.url',
    pageLinkRadioButton: '.toolbar .dialog .link_type_select input.page_link'
  },

  events: {
    'change': 'save'
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
    this.editor.on('show:dialog', _.bind(this.addPageLinkInputView, this));
  },

  save: function() {
    this.model.set(this.options.propertyName, this.editor.getValue());
  },

  load: function() {
    this.ui.input.val(this.model.get(this.options.propertyName));
  },

  addPageLinkInputView: function() {
    if (!this.options.enablePageLinks) {
      $('.toolbar .dialog .link_type_select').remove();
      $('.toolbar a.wysihtml5-command-dialog-opened').addClass('url_only')
      return;
    }

    this.ui.urlRadioButton.on('change', function() {
      $('.toolbar .dialog .link_type.url').show();
      $('.toolbar .dialog .link_type.page_link').hide();
    });

    this.ui.pageLinkRadioButton.on('change', function() {
      $('.toolbar .dialog .link_type.url').hide();
      $('.toolbar .dialog .link_type.page_link').show();
    });

    var currentUrl = this.ui.urlInput.val();

    this.pageLink = new Backbone.Model(
      {pageId: currentUrl.startsWith('#') ? currentUrl.substr(1) : ''}
    );

    this.listenTo(this.pageLink, 'change', function() {
      this.ui.urlInput.val('#'+this.pageLink.get('pageId'));
    });

    this.pageLinkInput = new pageflow.PageLinkInputView(_.extend({
      model: this.pageLink,
      propertyName: 'pageId',
      label: I18n.t('pageflow.ui.templates.inputs.text_area_input.target')
    }));

    this.ui.toolbar.find('.dialog .link_type.page_link')
      .empty()
      .append(this.pageLinkInput.render().el);

    if(currentUrl.startsWith('#')) {
      this.ui.urlInput.val('http://');
      this.ui.toolbar.find('.dialog .link_type_select .page_link').click();
    } else {
      this.ui.toolbar.find('.dialog .link_type_select .url').click();
    }
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
