require 'spec_helper'

feature 'admin adding an account' do
  scenario 'added account shows up in account table' do
    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_accounts_path)
    Dom::Admin::AccountsPage.first.add_link.click
    Dom::Admin::AccountForm.first.submit_with(:name => 'Codevise')
    visit(admin_accounts_path)

    expect(Dom::Admin::AccountInIndexTable.find_by_name('Codevise')).to be_present
  end

  scenario 'added account created new theming' do
    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_themings_path)
    count = Dom::Admin::ThemingInIndexTable.count

    visit(admin_accounts_path)
    Dom::Admin::AccountsPage.first.add_link.click
    Dom::Admin::AccountForm.first.submit_with(:name => 'Test')

    visit(admin_themings_path)
    new_count = Dom::Admin::ThemingInIndexTable.count

    expect(new_count).to eq(count + 1)
    expect(Dom::Admin::ThemingInIndexTable.find_by_account('Test')).not_to be_nil
  end
end
