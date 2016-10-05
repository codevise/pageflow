require 'spec_helper'

feature 'as system admin, deleting an account' do
  scenario 'deleted account does no longer exist' do
    account = create(:account, name: 'Codevise')

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_account_path(account))
    Dom::Admin::AccountPage.first.delete_link.click
    visit(admin_accounts_path)

    expect(Dom::Admin::AccountInIndexTable.find_by_name('Codevise')).not_to be_present
  end
end
