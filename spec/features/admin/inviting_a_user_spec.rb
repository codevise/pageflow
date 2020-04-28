require 'spec_helper'

feature 'as system admin, inviting a user' do
  scenario 'switching between accounts with and without free quota', js: true do
    account_with_quota = create(:account)
    account_without_quota = create(:account, name: 'No money honey')

    pageflow_configure do |config|
      config.quotas.register(
        :users, QuotaDouble.account_exhaustible([account_without_quota])
      )
    end

    Dom::Admin::Page.sign_in_as(:admin)
    visit(invitation_admin_users_path)

    Dom::Admin::InvitationForm.first.select_account(account_with_quota.id)
    expect(Dom::Admin::InvitationForm.first.has_quota_exhausted_error?).to eq(false)
    Dom::Admin::InvitationForm.first.select_account(account_without_quota.id)
    expect(Dom::Admin::InvitationForm.first.has_quota_exhausted_error?).to eq(true)
  end
end
