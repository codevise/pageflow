jQuery(function($) {
  $('.admin_users form.pageflow_invitation_form').each(function() {
    var quotaStates = $('.quota_state', this);
    var accountSelect = $('#invitation_form_membership_entity_id', this);
    var fieldsets = $('#invitation_form_details', this).add('fieldset.actions', this);

    function filterQuotaStatesBySelectedAccount() {
      var selectedAccountId = accountSelect.val();

      quotaStates.each(function(){
        var quotaState = $(this);
        var accountId = quotaState.data('accountId').toString();

        if (accountId !== selectedAccountId) {
          $(quotaState).hide();
        }
        else {
          $(quotaState).show();

          if ($(quotaState).data('state') === 'available') {
            fieldsets.show();
          }
          else {
            fieldsets.hide();
          }
        }
      });
    }

    filterQuotaStatesBySelectedAccount();
    accountSelect.on('change', filterQuotaStatesBySelectedAccount);
  });
});
