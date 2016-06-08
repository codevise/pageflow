require 'spec_helper'

feature 'as system admin, adding an account' do
  scenario 'added account shows up in account table' do
    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_accounts_path)
    Dom::Admin::AccountsPage.first.add_link.click
    Dom::Admin::AccountForm.first.submit_with(name: 'Codevise')
    visit(admin_accounts_path)

    expect(Dom::Admin::AccountInIndexTable.find_by_name('Codevise')).to be_present
  end
end
