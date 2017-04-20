jQuery(function($) {
  $('.admin_accounts form.pageflow_account').each(function() {
    var themeSelect = $('#account_default_theming_attributes_theme_name', this);
    if(window.location.pathname === "/admin/accounts/\d+/edit"){
      var themeOptions = JSON.parse($('script#theme_options', this).text());
    }
    var homeButtonCheckBox = $('#account_default_theming_attributes_home_button_enabled_by_default', this);

    updateThemeFeatures();
    themeSelect.on('change', updateThemeFeatures);

    function updateThemeFeatures() {
      toggleDisabled(homeButtonCheckBox, !selectedThemeSupportsHomeButton());
    }

    function selectedThemeSupportsHomeButton() {
      return !themeOptions[themeSelect.val()].no_home_button;
    }

    function toggleDisabled(checkBox, disabled) {
      if (disabled) {
        checkBox.data('wasChecked', checkBox.is(':checked'));
        checkBox.prop('checked', false);
        checkBox.prop('disabled', true);
      }
      else {
        checkBox.removeAttr('disabled');
        checkBox.prop('checked', checkBox.data('wasChecked'));
      }
    }
  });
});