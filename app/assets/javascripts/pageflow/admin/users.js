jQuery(function($) {
  $('.admin_users form.user').each(function() {
    var quotaStateDescriptions = $('.quota_states', this).children();
    var accountSelect = $('#user_initial_account', this);
    var that = this;

    function filterQuotaStateDescriptionsBySelectedAccount() {
      $.each(quotaStateDescriptions, function( index, value ){
        var accountId = $(value).context.dataset.accountId;
        var selectedAccountId = accountSelect.val();
        if (accountId !== selectedAccountId) {
          $(value).hide();
        }
        else {
          $(value).show();

          if ($(value).hasClass('available')) {
            enableCreateUserButton();
          }
          else {
            disableCreateUserButton();
          }
        }
      });
    }

    function disableCreateUserButton() {
      $('#user_submit_action input', that).addClass('disabled')
        .prop('disabled', true);
    }

    function enableCreateUserButton() {
      $('#user_submit_action input', that).removeClass('disabled')
        .prop('disabled', false);
    }

    filterQuotaStateDescriptionsBySelectedAccount();

    accountSelect.on('change', filterQuotaStateDescriptionsBySelectedAccount);
  });
});
