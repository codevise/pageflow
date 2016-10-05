require 'spec_helper'

feature 'as account publisher, editing account on entry' do
  scenario 'changing account' do
    entry = create(:entry, title: 'Test Entry')
    account_publisher = Dom::Admin::Page.sign_in_as(:publisher, on: entry.account)
    other_account = create(:account, name: 'Other Account', with_publisher: account_publisher)

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.edit_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(account_id: other_account.id)

    expect(Dom::Admin::EntryPage.first.account).to eq(other_account.name)
  end
end
