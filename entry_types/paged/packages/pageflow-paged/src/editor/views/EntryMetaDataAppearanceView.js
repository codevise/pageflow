import Marionette from 'backbone.marionette';
import _ from 'underscore';
import {CheckBoxInputView, TextInputView} from 'pageflow/ui';

export const EntryMetaDataAppearanceView = Marionette.View.extend({
  className: 'entry_meta_data_appearance',

  render: function() {
    var theme = this.options.entry.getTheme();

    this.input('manual_start', CheckBoxInputView);
    this.input('emphasize_chapter_beginning', CheckBoxInputView);
    this.input('emphasize_new_pages', CheckBoxInputView);
    this.input('home_button_enabled', CheckBoxInputView, {
      disabled: !theme.hasHomeButton(),
      displayUncheckedIfDisabled: true
    });
    this.input('overview_button_enabled', CheckBoxInputView, {
      disabled: !theme.hasOverviewButton(),
      displayUncheckedIfDisabled: true
    });
    if (theme.hasHomeButton()) {
      this.input('home_url', TextInputView, {
        placeholder: this.options.theming.get('pretty_url'),
        visibleBinding: 'home_button_enabled'
      });
    }

    return this;
  },

  input: function(propertyName, view, options) {
    var that = this.options.configurationEditorTabView;
    var inputView = new view(_.extend({
      propertyName,
      model: that.model,
      parentTab: that.options.tab
    }, options || {}));
    this.$el.append(inputView.render().el);
  }
});
