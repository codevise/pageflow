jQuery(function($) {
  $('.admin_accounts form.pageflow_account').each(function() {
    var themeSelect = $('#account_default_theming_attributes_theme_name', this);
    var themeOptions = JSON.parse($('script#theme_options', this).text());
    var homeButtonCheckBox = $('#account_default_theming_attributes_home_button_enabled_by_default', this);

    updateThemeFeatures();
    themeSelect.on('change', updateThemeFeatures);

    function updateThemeFeatures() {
      if (selectedThemeSupportsHomeButton()) {
        homeButtonCheckBox.removeAttr('disabled');
      }
      else {
        homeButtonCheckBox.attr('disabled', true);
      }
    }

    function selectedThemeSupportsHomeButton() {
      return themeOptions[themeSelect.val()].home_button;
    }
  });
});