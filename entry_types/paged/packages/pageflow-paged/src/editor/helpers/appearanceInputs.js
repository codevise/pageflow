import {CheckBoxInputView, TextInputView} from 'pageflow/ui';

export const appearanceInputs = (tabView, entry, theming) => {
  var theme = entry.getTheme();

  tabView.input('manual_start', CheckBoxInputView);
  tabView.input('emphasize_chapter_beginning', CheckBoxInputView);
  tabView.input('emphasize_new_pages', CheckBoxInputView);
  tabView.input('home_button_enabled', CheckBoxInputView, {
    disabled: !theme.hasHomeButton(),
    displayUncheckedIfDisabled: true
  });
  tabView.input('overview_button_enabled', CheckBoxInputView, {
    disabled: !theme.hasOverviewButton(),
    displayUncheckedIfDisabled: true
  });
  if (theme.hasHomeButton()) {
    tabView.input('home_url', TextInputView, {
      placeholder: theming.get('pretty_url'),
      visibleBinding: 'home_button_enabled'
    });
  }
};
