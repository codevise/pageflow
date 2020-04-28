jQuery(function($) {
  $('.admin_users form.pageflow_invitation_form').each(function() {
    var quotaStateContainer = $('#quota_state_container', this);
    var accountSelect = $('#invitation_form_membership_entity_id', this);
    var fieldsets = $('#invitation_form_details', this).add('fieldset.actions', this);

    function updateQutaState() {
      var selectedAccountId = accountSelect.val();

      $.get('/admin/users/quota_state?account_id=' + selectedAccountId)
        .done(function(html) {
          quotaStateContainer.html(html);
          updateForm();
        });
    }

    function updateForm() {
      if (quotaAvailable()) {
        fieldsets.show();
      }
      else {
        fieldsets.hide();
      }
    }

    function quotaAvailable() {
      return !!quotaStateContainer.find('[data-state=available]').length;
    }

    accountSelect.on('change', updateQutaState);
    updateForm();
  });
});
